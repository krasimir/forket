import React, { Suspense } from "react";

import Expandable from "./Expandable";
import Footer from "./Footer";

const C = Expandable;
const P = {
  foo: Expandable
}

export default async function App() {
  const notes = await db.notes.getAll();
  function markAsRead(note) {
    "use server";
    db.notes.markAsRead(note.id);
  }
  return (
    <div>
      {notes.map((note) => (
        <C key={note.id} markAsRead={markAsRead}>
          <p note={note} />
        </C>
      ))}
      <Suspense>
        <Footer numOfNotes={db.notes.getNumOfNotes()} />
      </Suspense>
    </div>
  );
}
