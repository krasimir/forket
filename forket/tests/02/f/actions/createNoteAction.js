import db from "./db";

export default async function createNoteAction () {
  "use server";
  db.createNote();
};
