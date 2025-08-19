"use client";
import React from "react";
import ImageUploader from "./ImageUploader.js";
import ImagesList from "./ImagesList.js";
function ImagesManager({ processImage, updateImage, images = [] }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ImageUploader, { processImage, updateImage }), /* @__PURE__ */ React.createElement(ImagesList, { images }));
}
export {
  ImagesManager as default
};
