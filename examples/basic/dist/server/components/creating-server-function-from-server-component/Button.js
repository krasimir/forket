"use client";
import React from "react";
function Button({ onClick }) {
  return /* @__PURE__ */ React.createElement("button", { onClick: () => {
    onClick().then(console.log);
  } }, "Create Empty Note");
}
export {
  Button as default
};
