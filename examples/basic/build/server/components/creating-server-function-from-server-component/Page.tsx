import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import db from './db.js';
import Button from "./Button.js";
export async function createNoteAction() {
    "use server";
    return await db.notes.create();
}
export default async function Page({ example }) {
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <EmptyNote/>
    </div>);
}
function EmptyNote() {
    return <ButtonBoundary onClick={"$FSA_createNoteAction"}/>;
}
function ButtonBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Button", "f_39"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_39" data-c="Button">
          {children}
        </template>)}
      <template type="forket/start/f_39" data-c="Button"></template>
      <Button {...props} children={children}/>
      <template type="forket/end/f_39" data-c="Button"></template>
      <script id="forket/init/f_39" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["f_39", "Button", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              $F_logs("‎𐂐 [server] <Button> (f_39) streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              $F_logs("‎𐂐 [server] <Button> (f_39) streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_39' || n.querySelector('[id="forket/init/f_39"]');
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
