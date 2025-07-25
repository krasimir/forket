var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var App_exports = {};
__export(App_exports, {
  Title: () => Title,
  default: () => App
});
module.exports = __toCommonJS(App_exports);
var import_react = __toESM(require("react"));
var import_Products = __toESM(require("./Products"));
function App() {
  return /* @__PURE__ */ import_react.default.createElement("html", null, /* @__PURE__ */ import_react.default.createElement("head", null, /* @__PURE__ */ import_react.default.createElement(Title, null)), /* @__PURE__ */ import_react.default.createElement("body", null, /* @__PURE__ */ import_react.default.createElement("div", { id: "root" }, /* @__PURE__ */ import_react.default.createElement("header", null, /* @__PURE__ */ import_react.default.createElement("h1", null, "Hello world")), /* @__PURE__ */ import_react.default.createElement(import_Products.default, null), /* @__PURE__ */ import_react.default.createElement("footer", null, "I'm a footer"))));
}
function Title() {
  return /* @__PURE__ */ import_react.default.createElement("title", null, "React Example");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Title
});
