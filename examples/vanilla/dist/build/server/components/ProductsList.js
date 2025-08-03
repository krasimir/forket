"use client";
import React, { useState } from "react";
import ProductListeItem from "./ProductListItem.js";
function ProductsList({ products, children }) {
  const [selected, setSelected] = useState([]);
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
    return /* @__PURE__ */ React.createElement("div", null, "No products yet ...");
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children, /* @__PURE__ */ React.createElement("p", null, "Selected items: ", selected.length), /* @__PURE__ */ React.createElement("ul", null, products.map((product) => /* @__PURE__ */ React.createElement("li", { key: product.id }, /* @__PURE__ */ React.createElement(ProductListeItem, { title: product.title, onClick: (e) => itemClicked(product) })))), /* @__PURE__ */ React.createElement("button", { onClick: buy }, "Add to cart"));
}
export {
  ProductsList as default
};
