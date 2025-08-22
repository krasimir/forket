"use server";
import db from "./db.js";
async function updateUsername({ data: [name] }) {
  if (!name) {
    return {
      error: "Name is required"
    };
  }
  return await db.users.updateName(name);
}
export {
  updateUsername
};
