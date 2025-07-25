import React from "react";
import path from "path";
import { renderToPipeableStream } from "react-dom/server";
import http from "http";
import express from "express";

import productsHandler from './api/products'

import App from './components/App'

const port = 8087;
// const TIMEOUT = 10000;
const TIMEOUT = 500;
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "..", "..", "public")));

app.get("/api/products", productsHandler(TIMEOUT));
app.get("/", (req, res) => {
  const { pipe, abort } = renderToPipeableStream(<App />, {
    bootstrapScripts: ["/bundle.js"],
    // bootstrapScripts: [],
    bootstrapScriptContent: replacer(),
    onShellReady() {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      processChunk(res);
      pipe(res);
    },
    onError(err) {
      console.error(err);
    }
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});
function processChunk(res) {
  function replaceAllBoundaryTags(html) {
    html = html
      .replace(/<boundary_f_(\d+)>/g, (_, n) => `<!-- $f_${n} -->`)
      .replace(/<\/boundary_f_(\d+)>/g, (_, n) => `<!-- /$f_${n} -->`)
      .replace(/<boundary_children_f_(\d+)>/, (_, n) => `<script type="forket/children" id="f_${n}_children">`)
      .replace(/<\/boundary_children_f_(\d+)>/, (_, n) => `</script>`);

    return html;
  }
  const originalWrite = res.write;
  res.write = (chunk: any) => {
    let str: string;
    if (Buffer.isBuffer(chunk)) {
      str = chunk.toString("utf8");
    } else if (chunk instanceof Uint8Array) {
      str = Buffer.from(chunk).toString("utf8");
    } else if (typeof chunk === "string") {
      str = chunk;
    } else {
      console.warn("Unknown chunk type:", chunk);
      str = String(chunk);
    }
    str = replaceAllBoundaryTags(str);
    originalWrite.call(res, Buffer.from(str, 'utf8'));
  };
}
function replacer() {
  return `
function FRSC_init() {
  if (typeof window.$FRSC === "undefined") {
    window.$FRSC = function (data) {
      const id = data[0];
      const compoName = data[1];
      const props = data[2];
      console.log('Trying to hydrate component', compoName, id);
      const boundary = findCommentBoundary(id);
      if (!boundary.start || !boundary.end) {
        console.warn("Boundary comments not found for id:", id);
        return;
      }
      const childrenProp = document.querySelector("#" + id + "_children");
      let childrenElements = null;
      if (childrenProp) {
        const childrenHTML = childrenProp.textContent;
        childrenElements = htmlToReactElements(childrenHTML);
      }
      let fragment = extractDomBetween(boundary.start, boundary.end)
      const container = document.createElement("div");
      container.style.display = 'contents';
      container.appendChild(fragment);
      boundary.end.parentNode.insertBefore(container, boundary.end);
      hydrateComponentBetweenMarkers(compoName, props, container, childrenElements);
      boundary.end.parentNode.removeChild(boundary.start);
      boundary.end.parentNode.removeChild(boundary.end);
    }
    if (typeof window.$FRSC_ !== "undefined" && window.$FRSC_.length > 0) {
      window.$FRSC_.forEach(window.$FRSC);
    }
  }
  function hydrateComponentBetweenMarkers(componentName, props, container, children) {
    const Component = window[componentName];
    hydrateRoot(container, React.createElement(Component, props, children));
  }
  function findCommentBoundary(id) {
    const iterator = document.createNodeIterator(
      document.body,
      NodeFilter.SHOW_COMMENT,
      null
    );

    let start = null;
    let end = null;

    let currentNode;
    while ((currentNode = iterator.nextNode())) {
      const nodeValue = currentNode.nodeValue.trim();
      if (nodeValue === '$' + id) {
        start = currentNode;
      } else if (nodeValue === '/$' + id) {
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
    const container = document.createElement('template');
    container.innerHTML = html.trim();

    const nodes = Array.from(container.content.childNodes);

    return nodes.map((node, index) => {
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
    }).filter(Boolean);
  }
};
window.addEventListener('load', FRSC_init)`;
}