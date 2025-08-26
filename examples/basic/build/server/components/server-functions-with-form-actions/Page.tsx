import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import UpdateName from "./UpdateName.js";
export default async function Page({ example }) {
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <UpdateNameBoundary/>
    </div>);
}
function UpdateNameBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "UpdateName", "f_45"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_45" data-c="UpdateName">
          {children}
        </template>)}
      <template type="forket/start/f_45" data-c="UpdateName"></template>
      <UpdateName {...props} children={children}/>
      <template type="forket/end/f_45" data-c="UpdateName"></template>
      <script id="forket/init/f_45" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["f_45", "UpdateName", ${JSON.stringify(serializedProps)}];
            console.log(JSON.stringify(window.$FLP_));
            if (typeof window.$FRSC === 'function') {
              console.log("‎𐂐 [server] <UpdateName> streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              console.log("‎𐂐 [server] <UpdateName> streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_45' || n.querySelector('[id="forket/init/f_45"]');
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
    }}></script>
    </>);
}
