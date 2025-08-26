import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from 'react';
import LikeButton from "./LikeButton.js";
import { getLikeCount } from "./actions.js";
export default function Page({ example }) {
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <LikeButtonBoundary initialCount={getLikeCount()}/>
    </div>);
}
function LikeButtonBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "LikeButton", "f_38"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_38" data-c="LikeButton">
          {children}
        </template>)}
      <template type="forket/start/f_38" data-c="LikeButton"></template>
      <LikeButton {...props} children={children}/>
      <template type="forket/end/f_38" data-c="LikeButton"></template>
      <script id="forket/init/f_38" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["f_38", "LikeButton", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              console.log("‎𐂐 [server] <LikeButton> streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              console.log("‎𐂐 [server] <LikeButton> streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_38' || n.querySelector('[id="forket/init/f_38"]');
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
