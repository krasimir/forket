import React from "react";
import { getProducts } from "./db.js";
import ProductsList from "./ProductsList.js";
async function Products() {
  const { products } = await getProducts();
  return /* @__PURE__ */ React.createElement(ProductsListBoundary, { products }, /* @__PURE__ */ React.createElement(ListOfProducts, { n: products.length }));
}
function ListOfProducts({ n }) {
  return /* @__PURE__ */ React.createElement("p", null, "All products: ", n);
}
function ProductsListBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_0", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_0", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_0", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_0", "ProductsList"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_0", "ProductsList"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_0", null, /* @__PURE__ */ React.createElement(ProductsList, { ...props, children })));
}
function forketSerializeProps(props) {
  function isValidElement(obj) {
    const keys = Object.keys(obj);
    return typeof obj === "object" && obj !== null && keys.includes("_owner") && keys.includes("_store") && keys.includes("props");
  }
  if (props == null || typeof props !== "object") return props;
  if (Array.isArray(props)) {
    return props.map(forketSerializeProps);
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
    const serializedProp = forketSerializeProps(value);
    if (serializedProp !== false) {
      serialized[key] = forketSerializeProps(value);
    }
  }
  return serialized;
}
export {
  Products as default
};
