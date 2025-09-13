"use server";
import DB from "../db.js";
async function processImage(formData, context) {
  return await DB.storeImage(context.request);
}
async function updateImage(id, content) {
  return await DB.setImageContent(id, content);
}
export {
  processImage,
  updateImage
};
