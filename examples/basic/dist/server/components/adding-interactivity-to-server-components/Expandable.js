"use client";
import React, { useState } from "react";
function Expandable({ children }) {
  const [expanded, setExpanded] = useState(false);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setExpanded(!expanded) }, "Toggle"), expanded && children);
}
export {
  Expandable as default
};
