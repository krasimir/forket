import React from "react";
function Image({ id, className, isPlaceholder, children }) {
  if (isPlaceholder) {
    return /* @__PURE__ */ React.createElement("div", { className: "grid p1 bordered " + (className || ""), style: { gridTemplateColumns: "1fr 4fr" } }, /* @__PURE__ */ React.createElement("div", { className: "image-placeholder" }), /* @__PURE__ */ React.createElement("div", { className: "px1" }, generateFakeText()));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "grid p1 bordered " + (className || ""), style: { gridTemplateColumns: "1fr 4fr" } }, /* @__PURE__ */ React.createElement("div", { className: "lh0" }, /* @__PURE__ */ React.createElement("img", { src: `/image/${id}`, alt: "Uploaded content", className: "image-fit" })), /* @__PURE__ */ React.createElement("div", { className: "px1" }, children));
}
function generateFakeText(lines = 10) {
  const text = [];
  for (let i = 0; i < lines; i++) {
    text.push("----- --------------- - ------ --- -----------");
  }
  return /* @__PURE__ */ React.createElement("span", { className: "op05" }, text.join(""));
}
export {
  Image as default
};
