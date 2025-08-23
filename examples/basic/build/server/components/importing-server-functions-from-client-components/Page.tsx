import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import EmptyNote from "./EmptyNote.js";
export default async function Page({ example }) {
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <EmptyNoteBoundary/>
    </div>);
}
function EmptyNoteBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "EmptyNote", "f_35"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_35", "EmptyNote", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="f_35" data-c="EmptyNote">
          {children}
        </template>)}
      <template type="forket/start" id="f_35" data-c="EmptyNote"></template>
      <EmptyNote {...props} children={children}/>
      <template type="forket/end" id="f_35" data-c="EmptyNote"></template>
    </>);
}
