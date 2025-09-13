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
    const serializedProps = JSON.stringify(forketSerializeProps(props, "UpdateMyName", "f_49"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_49" data-c="UpdateMyName">
          {children}
        </template>)}
      <template type="forket/start/f_49" data-c="UpdateMyName"></template>
      <UpdateMyName {...props} children={children}/>
      <template type="forket/end/f_49" data-c="UpdateMyName"></template>
      <script id="forket/init/f_49" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_49", "UpdateMyName", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
