"use client";
import React, { useContext } from "react";
import ImageComponent from "./Image.js";
import { ImagesContext } from "../contexts/ImagesContext.js";
function ImagesList() {
  const { images } = useContext(ImagesContext);
  if (!images || images.length === 0) {
    return null;
  } else {
    return /* @__PURE__ */ React.createElement("div", { className: "grid2 gap03 mt1" }, images.map((image) => /* @__PURE__ */ React.createElement(ImageComponent, { key: image.id, id: image.id }, /* @__PURE__ */ React.createElement("p", { className: "reset" }, image.content))));
  }
}
export {
  ImagesList as default
};
