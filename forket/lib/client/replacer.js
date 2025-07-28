(function () {
  function FRSC_init() {
    if (typeof window.$FRSC === "undefined") {
      window.$FRSC = function (data) {
        let childrenElements;
        const id = data[0];
        const componentName = data[1];
        const props = getContentFromScriptById(id + "_props", true);
        const childrenHTML = getContentFromScriptById(id + "_children");

        console.log("Hydrating", componentName, id, props, childrenHTML);
        const boundary = findCommentBoundary(id);
        if (!boundary.start || !boundary.end) {
          console.warn("Boundary comments not found for id:", id);
          return;
        }
        if (childrenHTML) {
          childrenElements = htmlToReactElements(childrenHTML);
        }
        let fragment = extractDomBetween(boundary.start, boundary.end);
        const container = document.createElement("div");
        container.style.display = "contents";
        container.appendChild(fragment);
        boundary.end.parentNode.insertBefore(container, boundary.end);
        hydrateComponentBetweenMarkers(componentName, props, container, childrenElements);
        boundary.end.parentNode.removeChild(boundary.start);
        boundary.end.parentNode.removeChild(boundary.end);
        removeScriptById(id + "_setup");
      };
      if (typeof window.$FRSC_ !== "undefined" && window.$FRSC_.length > 0) {
        window.$FRSC_.forEach(window.$FRSC);
      }
    }
    function getContentFromScriptById(id, isJSON) {
      const script = document.getElementById(id);
      if (!script) {
        return null;
      }
      let content = script.textContent;
      if (isJSON && content) {
        try {
          content = JSON.parse(content);
        } catch (e) {}
      }
      script.parentNode.removeChild(script);
      return content;
    }
    function removeScriptById(id) {
      const script = document.getElementById(id);
      if (script) {
        script.parentNode.removeChild(script);
      }
    }
    function hydrateComponentBetweenMarkers(componentName, props, container, children) {
      const Component = window[componentName];
      hydrateRoot(container, React.createElement(Component, props, children));
    }
    function findCommentBoundary(id) {
      const iterator = document.createNodeIterator(document.body, NodeFilter.SHOW_COMMENT, null);

      let start = null;
      let end = null;

      let currentNode;
      while ((currentNode = iterator.nextNode())) {
        const nodeValue = currentNode.nodeValue.trim();
        if (nodeValue === "$" + id) {
          start = currentNode;
        } else if (nodeValue === "/$" + id) {
          end = currentNode;
          break;
        }
      }

      return { start, end };
    }
    function extractDomBetween(startComment, endComment) {
      const fragment = document.createDocumentFragment();
      let current = startComment.nextSibling;

      while (current && current !== endComment) {
        const next = current.nextSibling;
        fragment.appendChild(current);
        current = next;
      }

      return fragment;
    }
    function htmlToReactElements(html) {
      const container = document.createElement("template");
      container.innerHTML = html.trim();

      const nodes = Array.from(container.content.childNodes);

      return nodes
        .map((node, index) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tag = node.tagName.toLowerCase();

            const props = { key: index };

            // Extract attributes
            for (const attr of node.attributes) {
              props[attr.name] = attr.value;
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