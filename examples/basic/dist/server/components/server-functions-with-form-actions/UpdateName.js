"use client";
import React, { useState, useActionState } from "react";
import { updateUsername } from "./actions.js";
function UpdateName() {
  const [name, setName] = useState("");
  const [state, submitAction, isPending] = useActionState(updateUsername, { error: null });
  console.log(state);
  return /* @__PURE__ */ React.createElement("form", { action: submitAction }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      name: "name",
      disabled: isPending,
      value: name,
      onChange: (e) => setName(e.target.value),
      placeholder: "type your name here"
    }
  ), state.error && /* @__PURE__ */ React.createElement("p", { style: { color: "red" } }, state.error));
}
export {
  UpdateName as default
};
