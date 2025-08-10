import db from "./db";

export const createNoteAction = async () => {
  // Server Function
  "use server";

  await db.notes.create();
}

function EmptyNote() {
  return <Button onClick={createNoteAction} />;
}
