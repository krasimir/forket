"use client";
import React, { useState, useTransition } from "react";
function LoginForm({ login }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  async function formSubmit(data) {
    setError(null);
    startTransition(async () => {
      if (!await login(data)) {
        setError("Ops! Something went wrong. Please try again later.");
        return;
      }
      window.location.reload();
    });
  }
  return /* @__PURE__ */ React.createElement("form", { action: formSubmit, className: "container-small mxauto" }, error && /* @__PURE__ */ React.createElement("div", { className: "fz08 mb1 p1 error" }, error), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, "Hey, my name is Ricardo. Your online AI assitant. I need to know your name and profession to help you better."), /* @__PURE__ */ React.createElement("label", { htmlFor: "username", className: "block mb1" }, "Please type your name:"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      id: "name",
      name: "name",
      required: true,
      placeholder: "Your name",
      autoFocus: true,
      disabled: isPending
    }
  ), /* @__PURE__ */ React.createElement("label", { htmlFor: "job", className: "block mb1 mt2" }, "Your job:"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      id: "job",
      name: "job",
      required: true,
      placeholder: "Your job",
      disabled: isPending
    }
  )), /* @__PURE__ */ React.createElement("button", { type: "submit", className: "mt2", disabled: isPending }, isPending ? "Please wait ..." : "Let's have a chat"));
}
export {
  LoginForm as default
};
