import React, { Suspense } from "react";

import db from './db.js';
import CommentsComp from "./Comments.js";

export default async function Page({ example }) {
  const note = await db.notes.get(42);
  const commentsPromise = db.comments.get(note.id);
  return (
    <div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr />
      <div>
        {note.content}
        <CommentsComp commentsPromise={commentsPromise} />
      </div>
    </div>
  );
}

