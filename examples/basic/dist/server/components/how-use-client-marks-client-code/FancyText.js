import React from "react";
function FancyText({ title, text }) {
  return title ? /* @__PURE__ */ React.createElement("h1", { className: "fancy title" }, text) : /* @__PURE__ */ React.createElement("h3", { className: "fancy cursive" }, text);
}
export {
  FancyText as default
};
