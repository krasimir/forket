"use client";
import React, { useActionState } from "react";
import Image from "./Image.js";
function ImageUploader({ processImage }) {
  const [result, formAction, isPending] = useActionState(async (currentState, formData) => {
    return await processImage(formData);
  }, null);
  function uploadImage(e) {
    const form = e.currentTarget.form;
    if (e.currentTarget.files?.length > 0 && form) {
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  }
  return /* @__PURE__ */ React.createElement("div", null, isPending && /* @__PURE__ */ React.createElement(Image, { isPlaceholder: true, className: "mb1" }), !isPending && result && /* @__PURE__ */ React.createElement(Image, { className: "mb1", id: result.id }, /* @__PURE__ */ React.createElement("p", null, "...")), /* @__PURE__ */ React.createElement("form", { action: formAction }, /* @__PURE__ */ React.createElement("label", { htmlFor: "image", className: "bordered p1" }, /* @__PURE__ */ React.createElement("span", { className: "btn", "aria-disabled": isPending }, isPending ? "Reading the image ..." : "Upload image"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      id: "image",
      name: "image",
      accept: "image/*",
      required: true,
      className: "hide",
      onChange: uploadImage,
      disabled: isPending
    }
  ))));
}
export {
  ImageUploader as default
};
