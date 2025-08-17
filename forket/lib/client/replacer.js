(function () {
  const FORKET_SERVER_ACTIONS_ENDPOINT = "{@}";
  const ATTR_MAP = {
    class: "className",
    for: "htmlFor",
    "http-equiv": "httpEquiv",
    "accept-charset": "acceptCharset",
    accesskey: "accessKey",
    autocapitalize: "autoCapitalize",
    autocomplete: "autoComplete",
    autofocus: "autoFocus",
    autoplay: "autoPlay",
    colspan: "colSpan",
    contenteditable: "contentEditable",
    crossorigin: "crossOrigin",
    enctype: "encType",
    formnovalidate: "formNoValidate",
    hreflang: "hrefLang",
    inputmode: "inputMode",
    maxlength: "maxLength",
    minlength: "minLength",
    novalidate: "noValidate",
    readonly: "readOnly",
    referrerpolicy: "referrerPolicy",
    rowspan: "rowSpan",
    spellcheck: "spellCheck",
    srcdoc: "srcDoc",
    srcset: "srcSet",
    tabindex: "tabIndex",
    usemap: "useMap"
  };
  function FRSC_init() {
    const d = document;
    if (typeof window.$FRSC === "undefined") {
      window.$FRSC = function (data) {
        const id = data[0];
        const componentName = data[1];
        const props = getContentFromScriptById("forket/props", id, true);
        let children = getContentFromTemplateById("forket/children", id);
        if (children) {
          children = htmlToReactElements(children);
        }

        console.log("Forket: " + componentName + "(" + id + ")", props, children);

        const boundary = findBoundary(id);
        if (!boundary.start || !boundary.end) {
          console.warn("Boundary not found for id:", id);
          return;
        }
        let fragment = extractDomBetween(boundary.start, boundary.end);
        const container = d.createElement("div");
        container.style.display = "contents";
        container.appendChild(fragment);
        boundary.end.parentNode.insertBefore(container, boundary.end);
        hydrateComponentBetweenMarkers(componentName, container, props, children);
        boundary.end.parentNode.removeChild(boundary.start);
        boundary.end.parentNode.removeChild(boundary.end);
      };
      if (typeof window.$FRSC_ !== "undefined" && window.$FRSC_.length > 0) {
        window.$FRSC_.forEach(window.$FRSC);
      }
    }
    function getContentFromScriptById(type, id, isJSON) {
      const script = d.querySelector(`script[type="${type}"]#${id}`);
      if (!script) {
        return null;
      }
      let content = script.textContent;
      if (isJSON && content) {
        try {
          content = JSON.parse(content, function (key, value) {
            if (typeof value === 'string' && value.match(/^\$FSA_/)) {
              const funcName = value.replace(/^\$FSA_/, "");
              return async function (data) {
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
                  body: JSON.stringify({ __actionId: value, ...data })
                });
                if (!result.ok) {
                  throw new Error(`Server action ${value} failed with status ${result.status}`);
                }
                const responseData = await result.json();
                return responseData.result;
              }
            }
            return value;
          });
        } catch (e) {
          // console.error("Error parsing JSON from script with id:", id, e);
          content = {};
        }
      }
      script.parentNode.removeChild(script);
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
    function extractDomBetween(start, end) {
      const fragment = d.createDocumentFragment();
      let current = start.nextSibling;

      while (current && current !== end) {
        const next = current.nextSibling;
        fragment.appendChild(current);
        current = next;
      }
      return fragment;
    }
    function hydrateComponentBetweenMarkers(componentName, container, props, children) {
      const Component = window[componentName];
      if (!Component) {
        console.error(`Forket: Component "${componentName}" not found.`);
        return;
      }
      ReactDOMClient.hydrateRoot(container, React.createElement(Component, props, children));
    }
    function htmlToReactElements(html) {
      const container = d.createElement("template");
      container.innerHTML = html.trim();

      const nodes = Array.from(container.content.childNodes);

      return nodes
        .map((node, index) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();

            const props = { key: index };

            // Extract attributes
            for (const attr of node.attributes) {
              const reactName = ATTR_MAP[attr.name.toLowerCase()] || attr.name;
              props[reactName] = attr.value;
            }

            // Inner content is preserved as raw HTML
            props.dangerouslySetInnerHTML = { __html: node.innerHTML };

            return React.createElement(tag, props);
          }

          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            return text ? text : null;
          }

          // Skip comment nodes
          return null;
        })
        .filter(Boolean);
    }
  }
  window.addEventListener("load", FRSC_init);
})();