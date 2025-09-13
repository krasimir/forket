"use server";
import db from './db.js';
export async function updateMyName(name) {
    if (!name) {
        return {
            error: "Name is required"
        };
    }
    return await db.users.updateName(name);
}
