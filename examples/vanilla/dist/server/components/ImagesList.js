import React from "react";
import ImageComponent from "./Image.js";
function ImagesList({ images, updating, onDeleteImage }) {
  if (!images || images.length === 0) {
    return /* @__PURE__ */ React.createElement("div", { className: "loading-box mt1 pt1 tac" }, "No images yet ...");
  } else {
    return /* @__PURE__ */ React.createElement("div", { className: "loading-box grid2 gap03 mt1 pt1", "data-loading": updating }, images.map((image) => /* @__PURE__ */ React.createElement(ImageComponent, { key: image.id, id: image.id }, /* @__PURE__ */ React.createElement("p", { className: "reset" }, image.content), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "reset abs",
        onClick: async () => {
          if (confirm("Are you sure?")) {
            onDeleteImage(image.id);
          }
        },
        style: { top: "12px", right: "18px" }
      },
      "\u2716"
    ))));
  }
}
export {
  ImagesList as default
};
