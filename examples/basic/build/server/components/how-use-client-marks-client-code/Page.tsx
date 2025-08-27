import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import FancyText from "./FancyText.js";
import InspirationGenerator from "./InspirationGenerator.js";
import Copyright from "./Copyright.js";
export default async function Page({ example }) {
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <FancyTextBoundary title text="Get Inspired App"/>
      <InspirationGeneratorBoundary>
        <Copyright year={2004}/>
      </InspirationGeneratorBoundary>
    </div>);
}
function FancyTextBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "FancyText", "f_40"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_40" data-c="FancyText">
          {children}
        </template>)}
      <template type="forket/start/f_40" data-c="FancyText"></template>
      <FancyText {...props} children={children}/>
      <template type="forket/end/f_40" data-c="FancyText"></template>
      <script id="forket/init/f_40" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["f_40", "FancyText", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              $F_logs("‎𐂐 [server] <FancyText> (f_40) streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              $F_logs("‎𐂐 [server] <FancyText> (f_40) streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_40' || n.querySelector('[id="forket/init/f_40"]');
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
function InspirationGeneratorBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "InspirationGenerator", "f_41"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_41" data-c="InspirationGenerator">
          {children}
        </template>)}
      <template type="forket/start/f_41" data-c="InspirationGenerator"></template>
      <InspirationGenerator {...props} children={children}/>
      <template type="forket/end/f_41" data-c="InspirationGenerator"></template>
      <script id="forket/init/f_41" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["f_41", "InspirationGenerator", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              $F_logs("‎𐂐 [server] <InspirationGenerator> (f_41) streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              $F_logs("‎𐂐 [server] <InspirationGenerator> (f_41) streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_41' || n.querySelector('[id="forket/init/f_41"]');
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
