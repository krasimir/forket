"use client";
import React, { useState, useTransition } from "react";
function LoginForm({ login }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  async function formSubmit(data) {
    setError(null);
    startTransition(async () => {
      if (!await login(data)) {
        setError("Error in login, please try again.");
        return;
      }
      window.location.reload();
    });
  }
  return /* @__PURE__ */ React.createElement("form", { action: formSubmit, className: "container-small mxauto" }, error && /* @__PURE__ */ React.createElement("div", { className: "fz08 mb1 p1 error" }, error), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { htmlFor: "username", className: "block mb1" }, "Please type your name:"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      id: "username",
      name: "username",
      required: true,
      placeholder: "Your name here",
      autoFocus: true,
      disabled: isPending
    }
  )), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "mt2", disabled: isPending }, isPending ? "Logging in ..." : "Login"));
}
export {
  LoginForm as default
};
