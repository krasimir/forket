function $F_booter(script, id, compName, serializedProps) {
  function init() {
    let a = [id, compName, serializedProps];
    if (typeof window.$FRSC === 'function') {
      $F_logs("‎𐂐 [server] <" + compName + "> (" + id + ") streaming done. Hydration in flight ...");
      window.$FRSC(a);
    } else {
      if (typeof $FRSC_ === 'undefined') {
        $FRSC_ = [];
      }
      $F_logs("𐂐 [server] <" + compName + "> (" + id + ") streaming done.");
      $FRSC_.push(a);
    }
    let me = document.currentScript;
    if (me) me.remove();
  }
  if (script.closest("div[hidden]")) {
    const observer = new MutationObserver((mutationsList) => {
      for(let i=0; i<mutationsList.length; i++) {
        const added = mutationsList[i].addedNodes;
        for(let j=0; j<added.length; j++) {
          const n = added[j];
          if (n.nodeType !== 1) continue;
          if (n.getAttribute) {
            const scriptNode = n.getAttribute('id') === 'forket/init/' + id || n.querySelector('[id="forket/init/' + id + '"]');
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
};