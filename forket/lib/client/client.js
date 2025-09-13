(function () {
  const roots = new Map();
  const renderers = (window.$F_renderers = {});

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
    let islands = typeof window.$FRSC_ !== "undefined" ? window.$FRSC_ : [];
    $F_logc(`𐂐 [client] 🏝️(${islands.length}) v${__VERSION__}`);
    if (typeof window.$FRSC === "undefined") {
      window.$FRSC = function (data) {
        const id = data[0];
        const componentName = data[1];
        const props = normalizeProps(data[2]);
        const children = getChildren(id);
        return hydrateComponentBetweenMarkers(id, componentName, props, children);
      };
    }
    if (islands.length > 0) {
      islands = window.$FRSC_ = islands.filter((i) => !window.$FRSC(i));
    }
    function hydrateComponentBetweenMarkers(id, componentName, props, children) {
      renderers[id] = function(newProps) {
        const Component = window['$' + id];
        if (!Component) {
          console.warn(`𐂐 Component <${componentName}> not found in the global scope yet. (${id})`);
          return false;
        }
        const boundary = {
          start: d.querySelector(`template[type="forket/start/${id}"]`),
          end: d.querySelector(`template[type="forket/end/${id}"]`)
        };
        if (!boundary.start || !boundary.end) {
          console.warn(`𐂐 Boundary not found for <${componentName}>. Re-trying rendering in 1 sec.`);
          setTimeout(() => renderers[id](newProps), 1000);
          return false;
        }
        const container = d.createElement("div");
        moveInServerGeneratedElements(boundary.start, boundary.end, container);
        container.style.display = "contents";
        boundary.end.parentNode.insertBefore(container, boundary.end);
        boundary.end.parentNode.removeChild(boundary.start);
        boundary.end.parentNode.removeChild(boundary.end);

        renderers[id] = function (newProps) {
          if (newProps) {
            props = { ...props, ...newProps };
          }
          $F_logc(`𐂐 [client] Render <${componentName}> (${id})`, { props, children });          
          mountOrUpdate(container, React.createElement(Component, props, children));
          return true;
        };
        return renderers[id](newProps);
      };
      return renderers[id]();
    }
    function normalizeProps(content) {
      try {
        content = JSON.parse(content, function (key, value) {
          if (key === "children") {
            return;
          }
          if (typeof value === "string" && value.match(/^\$FSA_/)) {
            const funcName = value.split('_').pop();
            return window.FSA_call(value, funcName);
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
                if (window.$FLP_[id].status === 'resolved') {
                  resolve(window.$FLP_[id].value);
                  return;
                } else if (window.$FLP_[id].status === 'rejected') {
                  reject(new Error(window.$FLP_[id].value));
                  return;
                } else {
                  window.$FLP_[id].resolve = resolve;
                  window.$FLP_[id].reject = reject;
                  FLP_process(id);
                }
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
    function getChildren(id) {
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
        root = ReactDomClient.hydrateRoot(container, element);
        roots.set(container, root);
      } else {
        root.render(element);
      }
    }
  }
  function FLP_process(id) {
    if (typeof id === "undefined") {
      console.warn("𐂐 FLP_process called without id.");
      return;
    }
    if (typeof window.$FLP_ !== "undefined" && window.$FLP_[id]) {
      const value = window.$FLP_[id].value;
      const status = window.$FLP_[id].status;
      const resolve = window.$FLP_[id].resolve;
      const reject = window.$FLP_[id].reject;
      const boundaryID = window.$FLP_[id].boundaryID;
      if (status === "resolved") {
        $F_logc(`𐂐 [client] Promise resolved (${id})`, value);
        if (resolve) {
          resolve(value)
          delete window.$FLP_[id];
        } else {
          $F_logc(
            `𐂐 [client] Promise with id ${id} is resolved but can't be consumed because the client boundary that needs it is not render yet.`
          );
        }
      } else if (status === "rejected") {
        $F_logc(`𐂐 [client] Promise rejected (${id})`, value);
        if (reject) {
          delete window.$FLP_[id];
          reject(new Error(value));
        } else {
          $F_logc(
            `𐂐 [client] Promise with id ${id} is rejected but can't be consumed because the client boundary that needs it is not render yet.`
          );
        }
      } else {
        console.warn(`𐂐 [client] Promise with id ${id} is in unknown state: ${status}.`);
        return;
      }
      if (renderers[boundaryID]) {
        renderers[boundaryID]();
      }
    } else {
      console.warn(
        `𐂐 [client] Promise with id ${id} not found in the global scope. The promise is resolved/rejected but the component boundary that needs it is not rendered yet or the promise is already consumed somehow.`
      );
    }
  }
  function FSA_call(id, funcName) {
    return async function (...args) {
      let fd;
      if (typeof FormData !== "undefined" && args[0] instanceof FormData) {
        fd = args[0];
        fd.append('__kind', 'formdata');
      } else {
        fd = new FormData();
        fd.append('__args', JSON.stringify(args.map(a => {
          if (typeof FormData !== "undefined" && a instanceof FormData) {
            const serializedFD = {};
            serializedFD.__fd = true;
            for (const [key, value] of a.entries()) {
              serializedFD[key] = value;
            }
            return serializedFD;
          }
          return a;
        })));
        fd.append("__kind", "json");
      }
      fd.append("__actionId", id);
      const result = await fetch($F_sae + "/" + funcName, {
        method: "POST",
        body: fd
      });
      if (!result.ok) {
        throw new Error(`Server action ${id} failed with status ${result.status}`);
      }
      const responseData = await result.json();
      return responseData.result;
    }
  }
  window.FRSC_init = FRSC_init;
  window.FSA_call = FSA_call;
  window.FLP_process = FLP_process;
  FRSC_init();
})();