import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import db from './db.js';
import Comments from "./Comments.js";
export default async function Page({ example }) {
    const note = await db.notes.get(42);
    const commentsPromise = db.comments.get(note.id);
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <div>
        {note.content}
        <CommentsBoundary commentsPromise={commentsPromise}/>
      </div>
    </div>);
}
function CommentsBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Comments", "f_47"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_47" data-c="Comments">
          {children}
        </template>)}
      <template type="forket/start/f_47" data-c="Comments"></template>
      <Comments {...props} children={children}/>
      <template type="forket/end/f_47" data-c="Comments"></template>
      <script id="forket/init/f_47" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_47", "Comments", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
