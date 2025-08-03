import React from "react";
import Products from "./Products.js";
function App() {
  return /* @__PURE__ */ React.createElement("html", null, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement(Title, null)), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("header", null, /* @__PURE__ */ React.createElement("h1", null, "Hello world")), /* @__PURE__ */ React.createElement(Products, null), /* @__PURE__ */ React.createElement("footer", null, "I'm a footer"))));
}
function Title() {
  return /* @__PURE__ */ React.createElement("title", null, "React Example");
}
export {
  Title,
  App as default
};
