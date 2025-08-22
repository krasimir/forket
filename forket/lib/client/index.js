(function () {
  const FORKET_SERVER_ACTIONS_ENDPOINT = "__FORKET_SERVER_ACTIONS_ENDPOINT__";
  const ENABLE_LOGGING = __ENABLE_LOGGIGN__;
  const log = ENABLE_LOGGING ? console.log.bind(console) : () => {};
  let SSR_DONE = false;
  const roots = new Map();

  log("𐂐 v" + __VERSION__);
  const ATTR_MAP = {
    class: "className",
    for: "htmlFor",
    readonly: "readOnly",
    tabindex: "tabIndex",
    maxlength: "maxLength",
    colspan: "colSpan",
    rowspan: "rowSpan"
  };
  const BOOLEAN_ATTRS = new Set([
    "allowfullscreen",
    "async",
    "autofocus",
    "autoplay",
    "checked",
    "controls",
    "default",
    "defer",
    "disabled",
    "formnovalidate",
    "hidden",
    "inert",
    "ismap",
    "loop",
    "multiple",
    "muted",
    "nomodule",
    "novalidate",
    "open",
    "playsinline",
    "readonly",
    "required",
    "reversed",
    "selected"
  ]);
  function FRSC_init() {
    const d = document;
    if (typeof window.$FRSC === "undefined") {
      window.$FRSC = function (data) {
        const id = data[0];
        const componentName = data[1];
        const props = normalizeProps(data[2]);
        const children = getChildren(id);
        hydrateComponentBetweenMarkers(id, componentName, props, children);
      };
      if (typeof window.$FRSC_ !== "undefined" && window.$FRSC_.length > 0) {
        window.$FRSC_.forEach(window.$FRSC);
      }
    }
    function hydrateComponentBetweenMarkers(id, componentName, props, children) {
      if (typeof window.$FRSC_renderers === "undefined") {
        window.$FRSC_renderers = {};
      }
      window.$FRSC_renderers[id] = function () {
        const Component = window[componentName];
        // log("𐂐 (attempt) " + componentName + "(" + id + ")", { props, children });
        if (!Component) {
          console.error(`𐂐 Component "${componentName}" not found.`);
          return;
        }
        const boundary = {
          start: d.querySelector(`template[type="forket/start"]#${id}`),
          end: d.querySelector(`template[type="forket/end"]#${id}`)
        };
        if (!boundary.start || !boundary.end) {
          // console.info("𐂐 Boundary not found for id: " + id);
          return;
        }
        const container = d.createElement("div");
        moveInServerGeneratedElements(boundary.start, boundary.end, container);
        container.style.display = "contents";
        boundary.end.parentNode.insertBefore(container, boundary.end);
        boundary.end.parentNode.removeChild(boundary.start);
        boundary.end.parentNode.removeChild(boundary.end);

        window.$FRSC_renderers[id] = () => {
          log("𐂐 " + componentName + "(" + id + ")", { props, children });
          mountOrUpdate(container, React.createElement(Component, props, children));
        }
        window.$FRSC_renderers[id]();
      }
      window.$FRSC_renderers[id]();
    }
    function normalizeProps(content) {
      try {
        content = JSON.parse(content, function (key, value) {
          if (key === "children") {
            return;
          }
          if (typeof value === "string" && value.match(/^\$FSA_/)) {
            const funcName = value.replace(/^\$FSA_/, "");
            return async function (...args) {
              const data = args.length > 0 ? args[0] : {};
              if (typeof FormData !== "undefined" && data instanceof FormData) {
                const fd = new FormData();
                fd.set("__actionId", value);
                for (const [k, v] of data.entries()) fd.append(k, v);
                const result = await fetch(FORKET_SERVER_ACTIONS_ENDPOINT + "/" + funcName, {
                  method: "POST",
                  body: fd
                });

                if (!result.ok) {
                  throw new Error(`Server action ${value} failed with status ${result.status}`);
                }
                const responseData = await result.json();
                if (responseData.error) throw new Error(responseData.error);
                return responseData.result;
              }
              const result = await fetch(FORKET_SERVER_ACTIONS_ENDPOINT + "/" + funcName, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ __actionId: value, data: args })
              });
              if (!result.ok) {
                throw new Error(`Server action ${value} failed with status ${result.status}`);
              }
              const responseData = await result.json();
              return responseData.result;
            };
          } else if (typeof value === "string" && value.match(/^\$FLP_/)) {
            return new Promise((resolve, reject) => {
              const id = value.replace(/^\$FLP_/, "");
              if (typeof window.$FLP_ === "undefined") {
                window.$FLP_ = {};
              }
              if (typeof window.$FLP_[id] === "undefined") {
                window.$FLP_[id] = {
                  status: 'unknown',
                  resolve,
                  reject
                };
              } else {
                window.$FLP_[id].resolve = resolve;
                window.$FLP_[id].reject = reject;
                FLP_process(id);
              }
            })
          }
          return value;
        });
      } catch (e) {
        console.warn("𐂐 Error parsing props content:", e);
        content = {};
      }
      return content;
    }
    function getChildren(type, id) {
      const template = d.querySelector(`template[type="forket/children"]#${id}`);
      if (!template) {
        return null;
      }
      const content = template.innerHTML;
      template?.parentNode?.removeChild(template);
      return htmlToReactElements(content);
    }
    function moveInServerGeneratedElements(start, end, newParent) {
      let current = start.nextSibling;
      while (current && current !== end) {
        const next = current.nextSibling;
        newParent.appendChild(current);
        current = next;
      }
    }
    function htmlToReactElements(html) {
      const tpl = document.createElement("template");
      tpl.innerHTML = html;
      const out = [];
      tpl.content.childNodes.forEach((n, i) => {
        const el = domNodeToReact(n, `root.${i}`);
        if (Array.isArray(el)) out.push(...el);
        else if (el !== null && el !== "") out.push(el);
      });
      return out;
    }
    function toCamel(s) {
      return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    }
    function parseStyle(styleText) {
      const style = {};
      styleText.split(";").forEach((rule) => {
        const [rawProp, rawVal] = rule.split(":");
        if (!rawProp || !rawVal) return;
        const prop = toCamel(rawProp.trim());
        let val = rawVal.trim();
        // numeric values without units become numbers
        if (!Number.isNaN(Number(val)) && val !== "") val = Number(val);
        style[prop] = val;
      });
      return style;
    }
    function attrToProps(el) {
      const props = {};
      for (const attr of el.attributes) {
        let name = attr.name.toLowerCase();
        const mapped = ATTR_MAP[name] || name;
        if (/^on[a-z]+$/.test(mapped)) continue;
        if (mapped === "style") {
          props.style = parseStyle(attr.value || "");
          continue;
        }
        if (BOOLEAN_ATTRS.has(name)) {
          props[mapped] = attr.value === "" || attr.value.toLowerCase() === name || attr.value.toLowerCase() === "true";
          continue;
        }
        props[mapped] = attr.value;
      }
      return props;
    }
    function domNodeToReact(node, keyPrefix) {
      switch (node.nodeType) {
        case Node.ELEMENT_NODE: {
          const tag = node.tagName.toLowerCase();
          const props = { ...attrToProps(node), key: keyPrefix };
          const children = [];
          node.childNodes.forEach((child, i) => {
            const reactChild = domNodeToReact(child, `${keyPrefix}.${i}`);
            if (reactChild !== null && reactChild !== "") children.push(reactChild);
          });
          return children.length ? React.createElement(tag, props, ...children) : React.createElement(tag, props);
        }
        case Node.TEXT_NODE: {
          const text = node.nodeValue;
          return text && !/^\s+$/.test(text) ? text : null;
        }
        case Node.DOCUMENT_FRAGMENT_NODE: {
          const kids = [];
          node.childNodes.forEach((child, i) => {
            const k = domNodeToReact(child, `${keyPrefix}.${i}`);
            if (k !== null && k !== "") kids.push(k);
          });
          return kids.length ? kids : null;
        }
        default:
          return null;
      }
    }
    function mountOrUpdate(container, element) {
      let root = roots.get(container);
      if (!root) {
        root = ReactDOMClient.hydrateRoot(container, element);
        roots.set(container, root);
      } else {
        root.render(element);
      }
    }
  }
  function FLP_process(id) {
    if (!SSR_DONE) return;
    if (typeof id === "undefined" && typeof window.$FLP_ !== "undefined") {
      Object.keys(window.$FLP_).forEach((id) => {
        FLP_process(id);
      });
    }
    if (typeof window.$FLP_ !== "undefined" && window.$FLP_[id]) {
      const value = window.$FLP_[id].value;
      const status = window.$FLP_[id].status;
      const resolve = window.$FLP_[id].resolve;
      const reject = window.$FLP_[id].reject;
      const boundaryID = window.$FLP_[id].boundaryID;
      if (status === "resolved") {
        resolve(value);
      } else if (status === "rejected") {
        reject(new Error(value));
      } else {
        console.warn(`𐂐 FLP: Promise with id ${id} is in unknown state: ${status}.`);
        return;
      }
      delete window.$FLP_[id];
      if (typeof window.$FRSC_renderers !== "undefined" && window.$FRSC_renderers[boundaryID]) {
        window.$FRSC_renderers[boundaryID]();
      }
    }
  }
  function FSSR_done() {
    SSR_DONE = true;
    FLP_process();
  }
  window.FLP_process = FLP_process;
  window.FSSR_done = FSSR_done;
  FRSC_init();
})();