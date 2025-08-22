"use client";
import React from "react";
import { createNote } from "./actions.js";
function EmptyNote() {
  return /* @__PURE__ */ React.createElement("button", { onClick: () => createNote().then(console.log) }, "Create note");
}
export {
  EmptyNote as default
};
