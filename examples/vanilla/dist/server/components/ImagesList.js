"use client";
import React from "react";
import ImageComponent from "./Image.js";
function ImagesList({ images }) {
  if (!images || images.length === 0) {
    return null;
  } else {
    return /* @__PURE__ */ React.createElement("div", { className: "grid gap1" }, images.map((image) => /* @__PURE__ */ React.createElement(ImageComponent, { key: image.id, className: "mb1", id: image.id }, /* @__PURE__ */ React.createElement("p", null, image.content))));
  }
}
export {
  ImagesList as default
};
