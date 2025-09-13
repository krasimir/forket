import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import Expandable from "./Expandable";
import Footer from './Footer';
export function markAsRead(note) {
    "use server";
    db.notes.markAsRead(note.id);
}
const C = ExpandableBoundary;
const P = {
    foo: ExpandableBoundary
};
export default async function App() {
    const notes = await db.notes.getAll();
    return (<div>
      {notes.map((note)=>(<C key={note.id} markAsRead={"$FSA_f_5_markAsRead"}>
          <p note={note}/>
        </C>))}
      <Suspense>
        <FooterBoundary numOfNotes={db.notes.getNumOfNotes()}/>
      </Suspense>
    </div>);
}
function ExpandableBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Expandable", "f_6"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_6" data-c="Expandable">
          {children}
        </template>)}
      <template type="forket/start/f_6" data-c="Expandable"></template>
      <Expandable {...props} children={children}/>
      <template type="forket/end/f_6" data-c="Expandable"></template>
      <script id="forket/init/f_6" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_6", "Expandable", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
function FooterBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Footer", "f_7"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_7" data-c="Footer">
          {children}
        </template>)}
      <template type="forket/start/f_7" data-c="Footer"></template>
      <Footer {...props} children={children}/>
      <template type="forket/end/f_7" data-c="Footer"></template>
      <script id="forket/init/f_7" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_7", "Footer", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
