import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import db from "./db.js";
import CommentsComp from "./Comments.js";
async function Page({ example }) {
  const note = await db.notes.get(42);
  const commentsPromise = db.comments.get(note.id);
  return /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("p", { className: "flex space-between" }, /* @__PURE__ */ React.createElement("a", { href: "/" }, "\u{1F448} Back"), /* @__PURE__ */ React.createElement("a", { href: example.reactdocs, target: "_blank" }, /* @__PURE__ */ React.createElement("small", null, "\u269B\uFE0F React docs"))), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement("div", null, note.content, /* @__PURE__ */ React.createElement(CommentsCompBoundary, { commentsPromise })));
}
function CommentsCompBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "CommentsComp", "f_43"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
          let a = ["f_43", "CommentsComp", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
  } }), children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_43", "data-c": "CommentsComp" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start", id: "f_43", "data-c": "CommentsComp" }), /* @__PURE__ */ React.createElement(CommentsComp, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end", id: "f_43", "data-c": "CommentsComp" }));
}
export {
  Page as default
};
