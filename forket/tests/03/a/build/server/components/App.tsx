import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import Expandable from "./Expandable";
import Footer from './Footer';
export function markAsRead(note) {
    "use server";
    db.notes.markAsRead(note.id);
}
export default async function App() {
    const notes = await db.notes.getAll();
    return (<div>
      {notes.map((note)=>(<ExpandableBoundary key={note.id} markAsRead={"$FSA_markAsRead"}>
          <p note={note}/>
        </ExpandableBoundary>))}
      <Suspense>
        <FooterBoundary numOfNotes={db.notes.getNumOfNotes()}/>
      </Suspense>
    </div>);
}
function ExpandableBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Expandable", "f_5"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_5" data-c="Expandable">
          {children}
        </template>)}
      <template type="forket/start/f_5" data-c="Expandable"></template>
      <Expandable {...props} children={children}/>
      <template type="forket/end/f_5" data-c="Expandable"></template>
      <script id="forket/init/f_5" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["f_5", "Expandable", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              $F_logs("‎𐂐 [server] <Expandable> (f_5) streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              $F_logs("‎𐂐 [server] <Expandable> (f_5) streaming done.");
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
function FooterBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Footer", "f_6"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_6" data-c="Footer">
          {children}
        </template>)}
      <template type="forket/start/f_6" data-c="Footer"></template>
      <Footer {...props} children={children}/>
      <template type="forket/end/f_6" data-c="Footer"></template>
      <script id="forket/init/f_6" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["f_6", "Footer", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              $F_logs("‎𐂐 [server] <Footer> (f_6) streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              $F_logs("‎𐂐 [server] <Footer> (f_6) streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_6' || n.querySelector('[id="forket/init/f_6"]');
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
