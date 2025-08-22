"use server";
import DB from "../db.js";
async function processImage(data, context) {
  "use server";
  return await DB.storeImage(context.request);
}
async function updateImage({ data: [id, content] }) {
  "use server";
  return await DB.setImageContent(id, content);
}
export {
  processImage,
  updateImage
};
