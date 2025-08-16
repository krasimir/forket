"use client";
import React from "react";
function ImageUploader({ processImage }) {
  function uploadImage(e) {
    const form = e.currentTarget.form;
    if (e.currentTarget.files?.length > 0 && form) {
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  }
  return /* @__PURE__ */ React.createElement("div", { className: "image-uploader" }, /* @__PURE__ */ React.createElement("form", { action: processImage, encType: "multipart/form-data" }, /* @__PURE__ */ React.createElement("label", { htmlFor: "image" }, /* @__PURE__ */ React.createElement("span", { className: "btn" }, "Upload image"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      id: "image",
      name: "image",
      accept: "image/*",
      required: true,
      className: "hide",
      onChange: uploadImage
    }
  ))));
}
export {
  ImageUploader as default
};
