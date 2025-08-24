import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import Expandable from "./Expandable";
import Footer from './Footer';
export function markAsRead(note) {
    "use server";
    db.notes.markAsRead(note.id);
}
export default async function App() {
    const notes = await db.notes.getAll();
    return (<div>
      {notes.map((note)=>(<ExpandableBoundary key={note.id} markAsRead={"$FSA_markAsRead"}>
          <p note={note}/>
        </ExpandableBoundary>))}
      <Suspense>
        <FooterBoundary numOfNotes={db.notes.getNumOfNotes()}/>
      </Suspense>
    </div>);
}
function ExpandableBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Expandable", "f_5"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_5", "Expandable", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="f_5" data-c="Expandable">
          {children}
        </template>)}
      <template type="forket/start" id="f_5" data-c="Expandable"></template>
      <Expandable {...props} children={children}/>
      <template type="forket/end" id="f_5" data-c="Expandable"></template>
    </>);
}
function FooterBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Footer", "f_6"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_6", "Footer", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="f_6" data-c="Footer">
          {children}
        </template>)}
      <template type="forket/start" id="f_6" data-c="Footer"></template>
      <Footer {...props} children={children}/>
      <template type="forket/end" id="f_6" data-c="Footer"></template>
    </>);
}
