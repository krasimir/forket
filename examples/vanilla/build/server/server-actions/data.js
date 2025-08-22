"use server";
import DB from '../db.js';
export async function processImage(data, context) {
    "use server";
    return await DB.storeImage(context.request);
}
export async function updateImage({ data: [id, content] }) {
    "use server";
    return await DB.setImageContent(id, content);
}
