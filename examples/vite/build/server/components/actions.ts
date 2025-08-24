"use server";
import db from './db.js';
export async function createNote() {
    return await db.notes.create();
}
