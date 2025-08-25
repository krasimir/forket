import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import LikeButton from "./LikeButton.js";
import { getLikeCount } from "./actions.js";
function Page({ example }) {
  return /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("p", { className: "flex space-between" }, /* @__PURE__ */ React.createElement("a", { href: "/" }, "\u{1F448} Back"), /* @__PURE__ */ React.createElement("a", { href: example.reactdocs, target: "_blank" }, /* @__PURE__ */ React.createElement("small", null, "\u269B\uFE0F React docs"))), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement(LikeButtonBoundary, { initialCount: getLikeCount() }));
}
function LikeButtonBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "LikeButton", "f_38"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
          let a = ["f_38", "LikeButton", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
  } }), children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_38", "data-c": "LikeButton" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start", id: "f_38", "data-c": "LikeButton" }), /* @__PURE__ */ React.createElement(LikeButton, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end", id: "f_38", "data-c": "LikeButton" }));
}
export {
  Page as default
};
