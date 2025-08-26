import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import db from "./db.js";
import Expandable from "./Expandable.js";
export default async function Notes() {
    const notes = await db.notes.getAll();
    return (<div>
      {notes.map((note)=>(<ExpandableBoundary key={note.id}>
          <p>{note.content}</p>
        </ExpandableBoundary>))}
    </div>);
}
function ExpandableBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Expandable", "f_36"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_36" data-c="Expandable">
          {children}
        </template>)}
      <template type="forket/start/f_36" data-c="Expandable"></template>
      <Expandable {...props} children={children}/>
      <template type="forket/end/f_36" data-c="Expandable"></template>
      <script id="forket/init/f_36" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["f_36", "Expandable", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              console.log("‎𐂐 [server] <Expandable> streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              console.log("‎𐂐 [server] <Expandable> streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_36' || n.querySelector('[id="forket/init/f_36"]');
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
