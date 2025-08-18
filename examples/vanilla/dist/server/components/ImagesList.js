"use client";
import React from "react";
import ImageComponent from "./Image.js";
function ImagesList({ images }) {
  if (!images || images.length === 0) {
    return null;
  } else {
    return /* @__PURE__ */ React.createElement("div", { className: "grid2 gap03 mt1" }, images.map((image) => /* @__PURE__ */ React.createElement(ImageComponent, { key: image.id, id: image.id }, /* @__PURE__ */ React.createElement("p", { className: "reset" }, image.content))));
  }
}
export {
  ImagesList as default
};
