"use server";
import db from "./db.js";
async function createNote() {
  return await db.notes.create();
}
export {
  createNote
};
