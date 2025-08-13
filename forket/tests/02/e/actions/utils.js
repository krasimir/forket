import db from "./db";

export const createNoteAction = () => {
  "use server";
  db.createNote();
};
export function deleteNote() {
  "use server";
  db.deleteNote();
}
export async function updateNote() {
  "use server";
  db.updateNote();
}
