import React, { Suspense } from "react";

import Expandable from "./Expandable";
import Footer from './Footer';

export default async function App() {
  const notes = await db.notes.getAll();
  function markAsRead(note) {
    "use server";
    db.notes.markAsRead(note.id);
  }
  return (
    <div>
      {notes.map((note) => (
        <Expandable key={note.id} markAsRead={markAsRead}>
          <p note={note} />
        </Expandable>
      ))}
      <Suspense>
        <Footer numOfNotes={db.notes.getNumOfNotes()} />
      </Suspense>
    </div>
  );
}