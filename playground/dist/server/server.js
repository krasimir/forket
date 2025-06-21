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
const app = (0, import_express.default)();
const server = import_http.default.createServer(app);
app.use(import_express.default.static(import_path.default.join(__dirname, "..", "public")));
app.get("/api/products", import_products.default);
app.get("/", (req, res) => {
  const stream = (0, import_server.renderToPipeableStream)(/* @__PURE__ */ import_react.default.createElement(import_App.default, null), {
    bootstrapScripts: ["/bundle.js"],
    onShellReady() {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      stream.pipe(res);
    },
    onError(err) {
      console.error(err);
    }
  });
});
server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});
