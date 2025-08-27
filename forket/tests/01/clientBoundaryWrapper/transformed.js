function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "LoginForm", "FORKETID111"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="FORKETID111" data-c="LoginForm">
          {children}
        </template>)}
      <template type="forket/start/FORKETID111" data-c="LoginForm"></template>
      <LoginForm {...props} children={children}/>
      <template type="forket/end/FORKETID111" data-c="LoginForm"></template>
      <script id="forket/init/FORKETID111" dangerouslySetInnerHTML={{
        __html: `(function () {
          function init() {
            let a = ["FORKETID111", "LoginForm", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              $F_logs("‎𐂐 [server] <LoginForm> (FORKETID111) streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              $F_logs("‎𐂐 [server] <LoginForm> (FORKETID111) streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/FORKETID111' || n.querySelector('[id="forket/init/FORKETID111"]');
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
