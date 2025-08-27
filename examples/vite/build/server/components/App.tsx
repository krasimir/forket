import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import { useState, Suspense } from "react";
import reactLogo from '../assets/react.svg';
import "./styles.css";
import EmptyNote from "./EmptyNote.js";
function App({ clientBundleFile }: {
    clientBundleFile: string;
}) {
    return (<html>
      <head>
        <title>👋</title>
      </head>
      <body>
        <header>
          <h1>Hey</h1>
        </header>
        <EmptyNoteBoundary/>
        <script type="module" src="/@vite/client"></script>
        <script type="module" src={clientBundleFile}></script>
      </body>
    </html>);
}
export default App;
function EmptyNoteBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "EmptyNote", "f_8"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_8" data-c="EmptyNote">
          {children}
        </template>)}
      <template type="forket/start/f_8" data-c="EmptyNote"></template>
      <EmptyNote {...props} children={children}/>
      <template type="forket/end/f_8" data-c="EmptyNote"></template>
      <script id="forket/init/f_8" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["f_8", "EmptyNote", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              $F_logs("‎𐂐 [server] <EmptyNote> (f_8) streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              $F_logs("‎𐂐 [server] <EmptyNote> (f_8) streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_8' || n.querySelector('[id="forket/init/f_8"]');
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
