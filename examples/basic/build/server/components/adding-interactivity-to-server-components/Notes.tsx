import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import db from "./db.js";
import Expandable from "./Expandable.js";
export default async function Notes() {
    const notes = await db.notes.getAll();
    return (<div>
      {notes.map((note)=>(<ExpandableBoundary key={note.id}>
          <p>{note.content}</p>
        </ExpandableBoundary>))}
    </div>);
}
function ExpandableBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Expandable", "f_33"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_33", "Expandable", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="f_33" data-c="Expandable">
          {children}
        </template>)}
      <template type="forket/start" id="f_33" data-c="Expandable"></template>
      <Expandable {...props} children={children}/>
      <template type="forket/end" id="f_33" data-c="Expandable"></template>
    </>);
}
