"use server";
import DB from '../db.js';
export async function processImage(formData, context) {
    return await DB.storeImage(context.request);
}
export async function updateImage(id, content) {
    return await DB.setImageContent(id, content);
}
