import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import UpdateName from "./UpdateName.js";
export default async function Page({ example }) {
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <UpdateNameBoundary/>
    </div>);
}
function UpdateNameBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "UpdateName", "f_40"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_40", "UpdateName", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="f_40" data-c="UpdateName">
          {children}
        </template>)}
      <template type="forket/start" id="f_40" data-c="UpdateName"></template>
      <UpdateName {...props} children={children}/>
      <template type="forket/end" id="f_40" data-c="UpdateName"></template>
    </>);
}
