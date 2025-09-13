import React from "react";
import db from "./db";
import Expandable from "./Expandable";
export default async function Page() {
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
