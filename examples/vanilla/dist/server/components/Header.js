"use client";
import React, { useState, useEffect } from "react";
function Header({ username, logout, greeting }) {
  const [message, setMessage] = useState("");
  useEffect(() => {
    greeting.then((message2) => {
      setMessage(message2);
    });
  }, [greeting]);
  return /* @__PURE__ */ React.createElement("header", { className: "mxauto mt2 mb3" }, /* @__PURE__ */ React.createElement("img", { src: "/assets/logo_white_350x84.png", alt: "forket logo", width: "200", className: "block mxauto" }), username && /* @__PURE__ */ React.createElement("span", { className: "block abs tar p05 op05", style: { top: 0, right: "90px" } }, message, ", ", username, "!"), username && /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "reset abs",
      onClick: async () => {
        if (await logout()) {
          window.location.reload();
        }
      },
      style: { top: "9px", right: "18px" }
    },
    "\u2716 logout"
  ));
}
export {
  Header as default
};
