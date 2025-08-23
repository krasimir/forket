"use client";
import React, { useState } from "react";
import inspirations from "./inspirations.js";
import FancyText from "./FancyText.js";
function InspirationGenerator({ children }) {
  const [index, setIndex] = useState(0);
  const quote = inspirations[index];
  const next = () => setIndex((index + 1) % inspirations.length);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "Your inspirational quote is:"), /* @__PURE__ */ React.createElement(FancyText, { text: quote }), /* @__PURE__ */ React.createElement("button", { onClick: next }, "Inspire me again"), children);
}
export {
  InspirationGenerator as default
};
