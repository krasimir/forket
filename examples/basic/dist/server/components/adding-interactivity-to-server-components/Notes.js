import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import db from "./db.js";
import Expandable from "./Expandable.js";
async function Notes() {
  const notes = await db.notes.getAll();
  return /* @__PURE__ */ React.createElement("div", null, notes.map((note) => /* @__PURE__ */ React.createElement(ExpandableBoundary, { key: note.id }, /* @__PURE__ */ React.createElement("p", null, note.content))));
}
function ExpandableBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "Expandable", "f_36"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_36", "data-c": "Expandable" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_36", "data-c": "Expandable" }), /* @__PURE__ */ React.createElement(Expandable, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_36", "data-c": "Expandable" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_36", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_36", "Expandable", ${JSON.stringify(serializedProps)});`
  } }));
}
export {
  Notes as default
};
