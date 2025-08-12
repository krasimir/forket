"use client";
import React, { useState } from "react";
function LoginForm({ login }) {
  const [error, setError] = useState(null);
  async function formSubmit(data) {
    setError(null);
    try {
      if (!await login(data)) {
        setError("Error in login, please try again.");
      }
    } catch (error2) {
      setError("Error in login, please try again.");
    }
  }
  return /* @__PURE__ */ React.createElement("form", { action: formSubmit }, error && /* @__PURE__ */ React.createElement("div", { className: "fz08 mb1 p1 error" }, error), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "username", className: "block mb1" }, "You are not logged in.", /* @__PURE__ */ React.createElement("br", null), "Please type your name:"), /* @__PURE__ */ React.createElement("input", { type: "text", id: "username", name: "username", required: true, placeholder: "Your name here", autoFocus: true })), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "mt2" }, "Login"));
}
export {
  LoginForm as default
};
