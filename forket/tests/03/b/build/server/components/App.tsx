import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Note from './Note';
import { saveNote } from "../server-actions/db.js";
export default async function App() {
    return <NoteBoundary saveNote={"$FSA_f_5_saveNote"}/>;
}
function NoteBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Note", "f_6"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_6" data-c="Note">
          {children}
        </template>)}
      <template type="forket/start/f_6" data-c="Note"></template>
      <Note {...props} children={children}/>
      <template type="forket/end/f_6" data-c="Note"></template>
      <script id="forket/init/f_6" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_6", "Note", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
