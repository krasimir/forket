import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Note from './Note';
import { saveNote } from "../server-actions/db.js";
export default async function App() {
    return <NoteBoundary saveNote={"$FSA_saveNote"}/>;
}
function NoteBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Note", "f_5"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_5" data-c="Note">
          {children}
        </template>)}
      <template type="forket/start/f_5" data-c="Note"></template>
      <Note {...props} children={children}/>
      <template type="forket/end/f_5" data-c="Note"></template>
      <script id="forket/init/f_5" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["f_5", "Note", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              $F_logs("‎𐂐 [server] <Note> (f_5) streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              $F_logs("‎𐂐 [server] <Note> (f_5) streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_5' || n.querySelector('[id="forket/init/f_5"]');
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
