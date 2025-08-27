import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import db from './db.js';
import Comments from './Comments.js';
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
        <Suspense fallback={<p>Loading Comments...</p>}>
          <div>
            <section>
              <CommentsBoundary commentsPromise={commentsPromise}/>
            </section>
          </div>
        </Suspense>
      </div>
    </div>);
}
function CommentsBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Comments", "f_37"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_37" data-c="Comments">
          {children}
        </template>)}
      <template type="forket/start/f_37" data-c="Comments"></template>
      <Comments {...props} children={children}/>
      <template type="forket/end/f_37" data-c="Comments"></template>
      <script id="forket/init/f_37" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_37", "Comments", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
