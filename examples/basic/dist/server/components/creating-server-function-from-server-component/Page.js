import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import db from "./db.js";
import Button from "./Button.js";
async function createNoteAction() {
  "use server";
  return await db.notes.create();
}
async function Page({ example }) {
  return /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("p", { className: "flex space-between" }, /* @__PURE__ */ React.createElement("a", { href: "/" }, "\u{1F448} Back"), /* @__PURE__ */ React.createElement("a", { href: example.reactdocs, target: "_blank" }, /* @__PURE__ */ React.createElement("small", null, "\u269B\uFE0F React docs"))), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement(EmptyNote, null));
}
function EmptyNote() {
  return /* @__PURE__ */ React.createElement(ButtonBoundary, { onClick: "$FSA_f_41_createNoteAction" });
}
function ButtonBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "Button", "f_42"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_42", "data-c": "Button" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_42", "data-c": "Button" }), /* @__PURE__ */ React.createElement(Button, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_42", "data-c": "Button" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_42", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_42", "Button", ${JSON.stringify(serializedProps)});`
  } }));
}
export {
  createNoteAction,
  Page as default
};
