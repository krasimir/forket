import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import UpdateMyName from "./UpdateMyName.js";
export default async function Page({ example }) {
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <UpdateMyNameBoundary/>
    </div>);
}
function UpdateMyNameBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "UpdateMyName", "f_44"));
    const children = props.children;
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_44", "UpdateMyName", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="f_44" data-c="UpdateMyName">
          {children}
        </template>)}
      <template type="forket/start" id="f_44" data-c="UpdateMyName"></template>
      <UpdateMyName {...props} children={children}/>
      <template type="forket/end" id="f_44" data-c="UpdateMyName"></template>
    </>);
}
