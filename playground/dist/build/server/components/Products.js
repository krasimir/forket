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
var Products_exports = {};
__export(Products_exports, {
  default: () => Products
});
module.exports = __toCommonJS(Products_exports);
var import_react = __toESM(require("react"));
var import_db = require("./db");
var import_ProductsList = __toESM(require("./ProductsList"));
function serialize$Props(props) {
  function isValidElement(obj) {
    const keys = Object.keys(obj);
    return typeof obj === "object" && obj !== null && keys.includes("_owner") && keys.includes("_store") && keys.includes("props");
  }
  if (props == null || typeof props !== "object") return props;
  if (Array.isArray(props)) {
    return props.map(serialize$Props);
  }
  if (isValidElement(props)) {
    return false;
  }
  const serialized = {};
  for (const key in props) {
    const value = props[key];
    if (typeof value === "function") {
      continue;
    }
    const serializedProp = serialize$Props(value);
    if (serializedProp !== false) {
      serialized[key] = serialize$Props(value);
    }
  }
  return serialized;
}
function ProductsListBoundary(props) {
  const serializedProps = JSON.stringify(serialize$Props(props));
  const children = props.children || [];
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("boundary_f_0", null, /* @__PURE__ */ import_react.default.createElement(import_ProductsList.default, { ...props, children })), /* @__PURE__ */ import_react.default.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
  const serializedProps = ${serializedProps};
  if (typeof $FRSC !== 'undefined') return $FRSC(["f_0", "ProductsList", serializedProps]);
  if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
  $FRSC_.push(["f_0", "ProductsList", serializedProps]);
})();`
  } }));
}
const CREDENTIALS = "secret";
console.log(CREDENTIALS);
async function Products() {
  const { products } = await (0, import_db.getProducts)();
  return /* @__PURE__ */ import_react.default.createElement(ProductsListBoundary, { products }, /* @__PURE__ */ import_react.default.createElement(ListOfProducts, { n: products.length }));
}
function ListOfProducts({ n }) {
  return /* @__PURE__ */ import_react.default.createElement("p", null, "All products: ", n);
}
