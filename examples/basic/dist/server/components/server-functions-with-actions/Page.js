import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import UpdateMyName from "./UpdateMyName.js";
async function Page({ example }) {
  return /* @__PURE__ */ React.createElement("div", { className: "container" }, /* @__PURE__ */ React.createElement("p", { className: "flex space-between" }, /* @__PURE__ */ React.createElement("a", { href: "/" }, "\u{1F448} Back"), /* @__PURE__ */ React.createElement("a", { href: example.reactdocs, target: "_blank" }, /* @__PURE__ */ React.createElement("small", null, "\u269B\uFE0F React docs"))), /* @__PURE__ */ React.createElement("hr", null), /* @__PURE__ */ React.createElement(UpdateMyNameBoundary, null));
}
function UpdateMyNameBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "UpdateMyName", "f_44"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_44", "data-c": "UpdateMyName" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_44", "data-c": "UpdateMyName" }), /* @__PURE__ */ React.createElement(UpdateMyName, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_44", "data-c": "UpdateMyName" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_44", dangerouslySetInnerHTML: {
    __html: `(function () {
          function init() {
            let a = ["f_44", "UpdateMyName", ${JSON.stringify(serializedProps)}];
            console.log(JSON.stringify(window.$FLP_));
            if (typeof window.$FRSC === 'function') {
              console.log("\u200E\u{10090} [server] <UpdateMyName> streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              console.log("\u200E\u{10090} [server] <UpdateMyName> streaming done.");
              $FRSC_.push(a);
            }
            let me = document.currentScript;
            if (me) me.remove();
          }
          if (document.currentScript.closest("div[hidden]")) {
            const observer = new MutationObserver((mutationsList) => {
              for(let i=0; i<mutationsList.length; i++) {
                const added = mutationsList[i].addedNodes;
                for(let j=0; j<added.length; j++) {
                  const n = added[j];
                  if (n.nodeType !== 1) continue;
                  if (n.getAttribute) {
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_44' || n.querySelector('[id="forket/init/f_44"]');
                    if (scriptNode) {
                      init();
                      observer.disconnect();
                      scriptNode.remove();
                      return;
                    }
                  }
                }
              }
            });
            observer.observe(
              document.documentElement,
              { childList: true, subtree: true }
            );
          } else {
            init();
          }
        })();
        `
  } }));
}
export {
  Page as default
};
