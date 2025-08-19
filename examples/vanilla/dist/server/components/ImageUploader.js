import React, { useActionState, useState, useTransition } from "react";
import Image from "./Image.js";
function ImageUploader({ processImage, updateImage, onImageUpdated }) {
  const [processedImage, setProcessedImage] = useState(null);
  const [isImageUpdating, startImageUpdate] = useTransition();
  let [_, formAction, isPending] = useActionState(async (currentState, formData) => {
    const result = await processImage(formData);
    setProcessedImage(result);
  }, null);
  function uploadImage(e) {
    const form = e.currentTarget.form;
    if (e.currentTarget.files?.length > 0 && form) {
      if (form.requestSubmit) form.requestSubmit();
      else form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    }
  }
  function setImageContent(id, content) {
    startImageUpdate(async () => {
      await updateImage(id, content);
      setProcessedImage(null);
      onImageUpdated();
    });
  }
  return /* @__PURE__ */ React.createElement("div", { className: "loading-box pt1", "data-loading": isPending }, /* @__PURE__ */ React.createElement("form", { action: formAction }, /* @__PURE__ */ React.createElement("label", { htmlFor: "image", className: "p1" }, /* @__PURE__ */ React.createElement("span", { className: "btn", "aria-disabled": isPending }, isPending ? "Reading the image ..." : "Upload image"), /* @__PURE__ */ React.createElement(
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
  ))), !isPending && processedImage && /* @__PURE__ */ React.createElement(Image, { className: "mt1", id: processedImage.id }, /* @__PURE__ */ React.createElement("ul", { className: "reset" }, processedImage.suggestions.map((item, index) => /* @__PURE__ */ React.createElement("li", { key: index }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "reset",
      onClick: () => setImageContent(processedImage.id, item.label),
      disabled: isImageUpdating
    },
    Math.round(item.score * 100),
    "% - ",
    /* @__PURE__ */ React.createElement("strong", null, item.label)
  ))))));
}
export {
  ImageUploader as default
};
