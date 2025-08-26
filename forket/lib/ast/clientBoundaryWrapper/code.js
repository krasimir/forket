function ComponentName(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "ProductsList", "f_1"));
  const children = props.children;
  return (
    <>
      {children && (
        <template type="forket/children" id="f_1" data-c="ProductsList">
          {children}
        </template>
      )}
      <template type="forket/start/f_1" data-c="ProductsList"></template>
      <ProductsList {...props} children={children} />
      <template type="forket/end/f_1" data-c="ProductsList"></template>
      <script
        id="forket/init/f_1"
        dangerouslySetInnerHTML={{
          __html: `(function () {
          function init() {
            let a = ["f_1", "ProductsList", ${JSON.stringify(serializedProps)}];
            if (typeof window.$FRSC === 'function') {
              console.log("‎𐂐 [server] <ProductsList> streaming done. Hydration in flight ...");
              window.$FRSC(a);
            } else {
              if (typeof $FRSC_ === 'undefined') {
                $FRSC_ = [];
              }
              console.log("‎𐂐 [server] <ProductsList> streaming done.");
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
                    const scriptNode = n.getAttribute('id') === 'forket/init/f_1' || n.querySelector('[id="forket/init/f_1"]');
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
        }}
      ></script>
    </>
  );
}
