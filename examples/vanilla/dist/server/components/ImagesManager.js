"use client";
import React, { useState, useTransition } from "react";
import ImageUploader from "./ImageUploader.js";
import ImagesList from "./ImagesList.js";
function ImagesManager({
  username,
  processImage,
  updateImage,
  initialImages = [],
  getImages
}) {
  const [images, setImages] = useState(initialImages);
  const [isUpdating, startUpdating] = useTransition();
  async function onImageUpdated() {
    startUpdating(async () => {
      const images2 = await getImages(username);
      setImages(images2);
    });
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ImageUploader, { processImage, updateImage, onImageUpdated }), /* @__PURE__ */ React.createElement(ImagesList, { images }));
}
export {
  ImagesManager as default
};
