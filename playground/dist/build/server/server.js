var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var import_react = __toESM(require("react"));
var import_path = __toESM(require("path"));
var import_server = require("react-dom/server");
var import_http = __toESM(require("http"));
var import_express = __toESM(require("express"));
var import_products = __toESM(require("./api/products"));
var import_App = __toESM(require("./components/App"));
const port = 8087;
const TIMEOUT = 500;
const app = (0, import_express.default)();
const server = import_http.default.createServer(app);
app.use(import_express.default.static(import_path.default.join(__dirname, "..", "..", "public")));
app.get("/api/products", (0, import_products.default)(TIMEOUT));
app.get("/", (req, res) => {
  const { pipe, abort } = (0, import_server.renderToPipeableStream)(/* @__PURE__ */ import_react.default.createElement(import_App.default, null), {
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
    return html.replace(/<boundary_f_(\d+)>/g, (_, n) => `<!-- $f_${n} -->`).replace(/<\/boundary_f_(\d+)>/g, (_, n) => `<!-- /$f_${n} -->`);
  }
  const originalWrite = res.write;
  res.write = (chunk) => {
    let str;
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
    originalWrite.call(res, Buffer.from(str, "utf8"));
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
