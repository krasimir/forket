import path from "path";
import { pipeline, env } from "@huggingface/transformers";
import { fileURLToPath } from "url";
import { storeImage } from "./utils/db.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
env.allowRemoteModels = true;
env.cacheDir = path.normalize(__dirname + "/../../../models");
async function processImage(data, context) {
  "use server";
  const file = context.request.files[0];
  if (!file) throw new Error("No file uploaded");
  const classify = await pipeline("image-classification", "Xenova/vit-base-patch16-224");
  const blob = new Blob([
    file.buffer
  ], {
    type: "image/jpeg"
  });
  const result = await classify(blob, {
    topk: 5
  });
  const id = await storeImage(context, file);
  return {
    id,
    result
  };
}
export {
  processImage
};
