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
          <CommentsBoundary commentsPromise={commentsPromise}/>
        </Suspense>
      </div>
    </div>);
}
function CommentsBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Comments", "f_24"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_24", "Comments", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="f_24" data-c="Comments">
          {children}
        </template>)}
      <template type="forket/start" id="f_24" data-c="Comments"></template>
      <Comments {...props} children={children}/>
      <template type="forket/end" id="f_24" data-c="Comments"></template>
    </>);
}
