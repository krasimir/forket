import db from "./db";

export default function deleteNote(id) {
  "use server";
  db.deleteNote(id);
};
