"use client";
import React, { useState, useTransition } from "react";
import { updateName } from "./actions.js";
function UpdateName() {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const submitAction = async () => {
    startTransition(async () => {
      const response = await updateName(name);
      console.log("Response from updateName:", response);
      if (response.error) {
        setError(response.error);
      } else {
        setError(null);
        setName("");
      }
    });
  };
  return /* @__PURE__ */ React.createElement("form", { action: submitAction }, /* @__PURE__ */ React.createElement("input", { type: "text", name: "name", disabled: isPending, value: name, onChange: (e) => setName(e.target.value) }), error && /* @__PURE__ */ React.createElement("span", null, "Failed: ", error));
}
export {
  UpdateName as default
};
