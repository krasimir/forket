(function () {
  const FORKET_SERVER_ACTIONS_ENDPOINT = "{@}";
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
        let children = getContentFromTemplateById("forket/children", id);
        if (children) {
          children = htmlToReactElements(children);
        }
        hydrateComponentBetweenMarkers(id, componentName, props, children);
      };
      if (typeof window.$FRSC_ !== "undefined" && window.$FRSC_.length > 0) {
        window.$FRSC_.forEach(window.$FRSC);
      }
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
          }
          return value;
        });
      } catch (e) {
        // console.error("Error parsing JSON from script with id:", id, e);
        content = {};
      }
      // script.parentNode.removeChild(script);
      return content;
    }
    function getContentFromTemplateById(type, id) {
      const template = d.querySelector(`template[type="${type}"]#${id}`);
      if (!template) {
        return null;
      }
      const content = template.innerHTML;
      template.parentNode.removeChild(template);
      return content;
    }
    function findBoundary(id) {
      return {
        start: d.querySelector(`template[type="forket/start"]#${id}`),
        end: d.querySelector(`template[type="forket/end"]#${id}`)
      };
    }
    function swapDOMElements(start, end, newParent) {
      let current = start.nextSibling;

      while (current && current !== end) {
        const next = current.nextSibling;
        newParent.appendChild(current);
        current = next;
      }
    }
    function hydrateComponentBetweenMarkers(id, componentName, props, children) {
      console.log("Forket: " + componentName + "(" + id + ")", { props, children });
      const Component = window[componentName];
      if (!Component) {
        console.error(`Forket: Component "${componentName}" not found.`);
        return;
      }
      const boundary = findBoundary(id);
      if (!boundary.start || !boundary.end) {
        console.warn("Boundary not found for id:", id);
        return;
      }
      const container = d.createElement("div");
      swapDOMElements(boundary.start, boundary.end, container);
      container.style.display = "contents";
      boundary.end.parentNode.insertBefore(container, boundary.end);
      ReactDOMClient.hydrateRoot(container, React.createElement(Component, props, children));
      boundary.end.parentNode.removeChild(boundary.start);
      boundary.end.parentNode.removeChild(boundary.end);
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
  }
  window.addEventListener("load", FRSC_init);
})();