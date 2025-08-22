import React, { Suspense } from "react";

import db from './db.js';
import Button from "./Button.js";

export default async function Page({ example }) {
  return (
    <div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr />
      <EmptyNote />
    </div>
  );
}

function EmptyNote() {
  async function createNoteAction() {
    // Server Function
    "use server";

    return await db.notes.create();
  }

  return <Button onClick={createNoteAction} />;
}
