import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import UpdateMyName from "./UpdateMyName.js";
async function Page({ example }) {
  return /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("p", { className: "flex space-between" }, /* @__PURE__ */ React.createElement("a", { href: "/" }, "\u{1F448} Back"), /* @__PURE__ */ React.createElement("a", { href: example.reactdocs, target: "_blank" }, /* @__PURE__ */ React.createElement("small", null, "\u269B\uFE0F React docs"))), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement(UpdateMyNameBoundary, null));
}
function UpdateMyNameBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "UpdateMyName", "f_49"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_49", "data-c": "UpdateMyName" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_49", "data-c": "UpdateMyName" }), /* @__PURE__ */ React.createElement(UpdateMyName, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_49", "data-c": "UpdateMyName" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_49", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_49", "UpdateMyName", ${JSON.stringify(serializedProps)});`
  } }));
}
export {
  Page as default
};
