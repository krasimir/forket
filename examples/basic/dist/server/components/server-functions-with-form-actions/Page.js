import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import UpdateName from "./UpdateName.js";
async function Page({ example }) {
  return /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("p", { className: "flex space-between" }, /* @__PURE__ */ React.createElement("a", { href: "/" }, "\u{1F448} Back"), /* @__PURE__ */ React.createElement("a", { href: example.reactdocs, target: "_blank" }, /* @__PURE__ */ React.createElement("small", null, "\u269B\uFE0F React docs"))), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement(UpdateNameBoundary, null));
}
function UpdateNameBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "UpdateName", "f_45"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_45", "data-c": "UpdateName" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_45", "data-c": "UpdateName" }), /* @__PURE__ */ React.createElement(UpdateName, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_45", "data-c": "UpdateName" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_45", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_45", "UpdateName", ${JSON.stringify(serializedProps)});`
  } }));
}
export {
  Page as default
};
