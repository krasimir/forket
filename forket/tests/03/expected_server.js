import React, { Suspense } from "react";
import Products from "./Products";
import { getProducts } from "./db";
export default async function App() {
    return /*#__PURE__*/ React.createElement("html", null, /*#__PURE__*/ React.createElement("head", null, /*#__PURE__*/ React.createElement(Title, null)), /*#__PURE__*/ React.createElement("body", null, /*#__PURE__*/ React.createElement("div", {
        id: "root"
    }, /*#__PURE__*/ React.createElement("h1", null, "React Example"), /*#__PURE__*/ React.createElement(Suspense, {
        fallback: /*#__PURE__*/ React.createElement("p", null, "Loading products...")
    }, /*#__PURE__*/ React.createElement(Products, {
        getProducts: getProducts()
    })))));
}
function Title() {
    return /*#__PURE__*/ React.createElement("title", null, "React Example");
}
