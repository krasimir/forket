"use client";
import React from "react";
function LoginForm({ login }) {
  return /* @__PURE__ */ React.createElement("form", { action: login }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "username", className: "block mb1" }, "You are not logged in.", /* @__PURE__ */ React.createElement("br", null), "Please type your name:"), /* @__PURE__ */ React.createElement("input", { type: "text", id: "username", name: "username", required: true, placeholder: "Your name here", autoFocus: true })), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "mt2" }, "Login"));
}
export {
  LoginForm as default
};
