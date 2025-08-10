import db from "./db";

async function createNoteAction() {
  // Server Function
  "use server";

  await db.notes.create();
}

function EmptyNote() {
  return <Button onClick={createNoteAction} />;
}
