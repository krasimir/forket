import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import FancyText from "./FancyText.js";
import InspirationGenerator from "./InspirationGenerator.js";
import Copyright from "./Copyright.js";
async function Page({ example }) {
  return /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("p", { className: "flex space-between" }, /* @__PURE__ */ React.createElement("a", { href: "/" }, "\u{1F448} Back"), /* @__PURE__ */ React.createElement("a", { href: example.reactdocs, target: "_blank" }, /* @__PURE__ */ React.createElement("small", null, "\u269B\uFE0F React docs"))), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement(FancyTextBoundary, { title: true, text: "Get Inspired App" }), /* @__PURE__ */ React.createElement(InspirationGeneratorBoundary, null, /* @__PURE__ */ React.createElement(Copyright, { year: 2004 })));
}
function FancyTextBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "FancyText", "f_40"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_40", "data-c": "FancyText" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_40", "data-c": "FancyText" }), /* @__PURE__ */ React.createElement(FancyText, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_40", "data-c": "FancyText" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_40", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_40", "FancyText", ${JSON.stringify(serializedProps)});`
  } }));
}
function InspirationGeneratorBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "InspirationGenerator", "f_41"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_41", "data-c": "InspirationGenerator" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_41", "data-c": "InspirationGenerator" }), /* @__PURE__ */ React.createElement(InspirationGenerator, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_41", "data-c": "InspirationGenerator" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_41", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_41", "InspirationGenerator", ${JSON.stringify(serializedProps)});`
  } }));
}
export {
  Page as default
};
