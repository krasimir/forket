import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Note from './Note';
import { saveNote } from "../server-actions/db.js";
export default async function App() {
    return <NoteBoundary saveNote={"$FSA_saveNote"}/>;
}
function NoteBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Note", "f_5"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_5", "Note", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="f_5" data-c="Note">
          {children}
        </template>)}
      <template type="forket/start" id="f_5" data-c="Note"></template>
      <Note {...props} children={children}/>
      <template type="forket/end" id="f_5" data-c="Note"></template>
    </>);
}
