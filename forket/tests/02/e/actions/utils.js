import db from "./db";

export const createNoteAction = () => {
  "use server";
  db.createNote();
};
