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
    const serializedProps = JSON.stringify(forketSerializeProps(props, "EmptyNote", "f_46"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_46" data-c="EmptyNote">
          {children}
        </template>)}
      <template type="forket/start/f_46" data-c="EmptyNote"></template>
      <EmptyNote {...props} children={children}/>
      <template type="forket/end/f_46" data-c="EmptyNote"></template>
      <script id="forket/init/f_46" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_46", "EmptyNote", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
