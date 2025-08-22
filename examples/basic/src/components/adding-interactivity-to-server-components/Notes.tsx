import React from "react";

import db from "./db.js";
import Expandable from "./Expandable.js";

export default async function Notes() {
  const notes = await db.notes.getAll();

  return (
    <div>
      {notes.map((note) => (
        <Expandable key={note.id}>
          <p>{note.content}</p>
        </Expandable>
      ))}
    </div>
  );
}
