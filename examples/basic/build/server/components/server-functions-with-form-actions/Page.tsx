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
    const serializedProps = JSON.stringify(forketSerializeProps(props, "UpdateName", "f_45"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_45" data-c="UpdateName">
          {children}
        </template>)}
      <template type="forket/start/f_45" data-c="UpdateName"></template>
      <UpdateName {...props} children={children}/>
      <template type="forket/end/f_45" data-c="UpdateName"></template>
      <script id="forket/init/f_45" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_45", "UpdateName", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
