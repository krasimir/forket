"use server";

import db from './db.js';

export async function updateUsername(currentState, formData: FormData) {
  if (!formData.get("name") || formData.get("name") === '') {
    return { error: "Name is required" };
  }
  return await db.users.updateName(formData.get("name"));
}
