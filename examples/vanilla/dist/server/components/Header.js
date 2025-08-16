"use client";
import React from "react";
function Header({ username, logout }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("header", { className: "mxauto mt2 mb3" }, /* @__PURE__ */ React.createElement("img", { src: "/assets/logo_white_350x84.png", alt: "forket logo", width: "200", className: "block mxauto" }), username && /* @__PURE__ */ React.createElement("span", { className: "block abs tar p05 op05", style: { top: 0, right: "90px" } }, "Hey, ", username, "!"), username && /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "reset abs",
      onClick: async () => {
        if (await logout()) {
          window.location.reload();
        }
      },
      style: { top: 0, right: 0 }
    },
    "\u2716 logout"
  )));
}
export {
  Header as default
};
