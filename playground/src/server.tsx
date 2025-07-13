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
    // bootstrapScripts: ["/bundle.js"],
    // bootstrapScripts: [],
    // bootstrapScriptContent: replacer(),
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
    return html
      .replace(/<boundary_f_(\d+)>/g, (_, n) => `<!-- $f_${n} -->`)
      .replace(/<\/boundary_f_(\d+)>/g, (_, n) => `<!-- /$f_${n} -->`);
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
  return `function FRSC_init() {
  console.log('FRSC_init')
  if (typeof window.$FRSC === "undefined") {
    window.$FRSC = function (id) {
      const template = document.querySelector(\`[data-client-component][data-id="\${id}"]\`);
      if (!template) {
        console.warn("No client component found for id:", id);
        return;
      }
      const props = JSON.parse(template.getAttribute("data-props") || "{}");
      const componentName = template.getAttribute("data-component");
      if (!componentName) {
        console.warn("No component name found for id:", id);
        return;
      }
      const Component = window[componentName];
      if (typeof Component !== "function") {
        console.warn("Component not found:", componentName);
        return;
      }
      const element = React.createElement(Component, props);
      const host = document.createElement("div");
      const root = createRoot(host);
      root.render(element);
      template.replaceWith(host);
      // window.hydrateRoot(template, element);
    }
    if (typeof window.$FRSC_ !== "undefined" && window.$FRSC_.length > 0) {
      window.$FRSC_.forEach(window.$FRSC);
    }
  }
};
window.addEventListener('load', FRSC_init)`;
}