import React from "react";
function ProductListeItem({ title, onClick }) {
  return /* @__PURE__ */ React.createElement("label", null, /* @__PURE__ */ React.createElement("input", { type: "checkbox", onClick }), title);
}
export {
  ProductListeItem as default
};
