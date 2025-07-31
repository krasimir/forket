(function () {
  function FRSC_init() {
    const d = document;
    if (typeof window.$FRSC === "undefined") {
      window.$FRSC = function (data) {
        const id = data[0];
        const componentName = data[1];
        const props = getContentFromScriptById(id + "_props", true);
        let children = getContentFromScriptById(id + "_children");
        if (children) {
          children = htmlToReactElements(children);
        }

        console.log(componentName + "(" + id + ")", props, children);

        const boundary = findCommentBoundary(id);
        if (!boundary.start || !boundary.end) {
          console.warn("Boundary comments not found for id:", id);
          return;
        }
        let fragment = extractDomBetween(boundary.start, boundary.end);
        const container = d.createElement("div");
        container.style.display = "contents";
        container.appendChild(fragment);
        boundary.end.parentNode.insertBefore(container, boundary.end);
        hydrateComponentBetweenMarkers(componentName, props, container, children);
        boundary.end.parentNode.removeChild(boundary.start);
        boundary.end.parentNode.removeChild(boundary.end);
        removeById(id + "_setup");
      };
      if (typeof window.$FRSC_ !== "undefined" && window.$FRSC_.length > 0) {
        window.$FRSC_.forEach(window.$FRSC);
      }
    }
    function getContentFromScriptById(id, isJSON) {
      const script = d.getElementById(id);
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
    function removeById(id) {
      const el = d.getElementById(id);
      if (el) {
        el.parentNode.removeChild(el);
      }
    }
    function findCommentBoundary(id) {
      const iterator = d.createNodeIterator(d.body, NodeFilter.SHOW_COMMENT, null);

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
      const fragment = d.createDocumentFragment();
      let current = startComment.nextSibling;

      while (current && current !== endComment) {
        const next = current.nextSibling;
        fragment.appendChild(current);
        current = next;
      }
      return fragment;
    }
    function hydrateComponentBetweenMarkers(componentName, props, container, children) {
      const Component = window[componentName];
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