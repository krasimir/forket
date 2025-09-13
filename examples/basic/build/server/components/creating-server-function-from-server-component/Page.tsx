import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import db from './db.js';
import Button from "./Button.js";
export async function createNoteAction() {
    "use server";
    return await db.notes.create();
}
export default async function Page({ example }) {
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <EmptyNote/>
    </div>);
}
function EmptyNote() {
    return <ButtonBoundary onClick={"$FSA_f_41_createNoteAction"}/>;
}
function ButtonBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Button", "f_42"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_42" data-c="Button">
          {children}
        </template>)}
      <template type="forket/start/f_42" data-c="Button"></template>
      <Button {...props} children={children}/>
      <template type="forket/end/f_42" data-c="Button"></template>
      <script id="forket/init/f_42" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_42", "Button", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
