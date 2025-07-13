import React from "react";
import path from "path";
import { renderToPipeableStream } from "react-dom/server";
import http from "http";
import express from "express";

import productsHandler from './api/products'

import App from './components/App'

const port = 8087;
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "..", "..", "public")));

app.get("/api/products", productsHandler);
app.get("/", (req, res) => {
  const { pipe, abort } = renderToPipeableStream(<App />, {
    bootstrapScripts: ["/bundle.js"],
    // bootstrapScripts: [],
    bootstrapScriptContent: replacer(),
    onShellReady() {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      const originalWrite = res.write;
      res.write = (chunk: any) => {
        // console.log(chunk.toString());
        originalWrite.call(res, chunk);
      };
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
      console.log(props);
      const element = React.createElement(Component, {products:[]});
      window.hydrateRoot(template, element);
    }
    if (typeof window.$FRSC_ !== "undefined" && window.$FRSC_.length > 0) {
      window.$FRSC_.forEach(window.$FRSC);
    }
  }
};
window.addEventListener('load', FRSC_init)`;
}