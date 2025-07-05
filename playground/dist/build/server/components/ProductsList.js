"use client";
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
var ProductsList_exports = {};
__export(ProductsList_exports, {
  default: () => ProductsList
});
module.exports = __toCommonJS(ProductsList_exports);
var import_react = __toESM(require("react"));
function ProductsList({ products }) {
  const [selected, setSelected] = (0, import_react.useState)([]);
  const addToCart = (ids) => ({ products: ids.length });
  function itemClicked(product) {
    const index = selected.indexOf(product.id);
    if (index === -1) {
      setSelected([...selected, product.id]);
    } else {
      setSelected(selected.filter((id) => id !== product.id));
    }
  }
  async function buy() {
    const { products: products2 } = await addToCart(selected);
    alert(`Added ${products2} items to cart`);
  }
  if (products.length === 0) {
    return null;
  }
  return /* @__PURE__ */ import_react.default.createElement(import_react.default.Fragment, null, /* @__PURE__ */ import_react.default.createElement("p", null, "Selected items: ", selected.length), /* @__PURE__ */ import_react.default.createElement("ul", null, products.map((product) => /* @__PURE__ */ import_react.default.createElement("li", { key: product.id }, /* @__PURE__ */ import_react.default.createElement("label", null, /* @__PURE__ */ import_react.default.createElement("input", { type: "checkbox", onClick: (e) => itemClicked(product) }), product.title)))), /* @__PURE__ */ import_react.default.createElement("button", { onClick: buy }, "Add to cart"));
}
