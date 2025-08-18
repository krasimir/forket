import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";
import { pipeline, env } from "@huggingface/transformers";
import { COOKIES } from "./constants.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
env.allowRemoteModels = true;
env.cacheDir = path.normalize(__dirname + "/../../models");
const DB_DIR = path.resolve(__dirname, path.join("..", "..", "db"));
const DB = {
  storeImage,
  getImages,
  getImagesByUsername,
  setImageContent
};
let images;
async function storeImage(request) {
  const id = crypto.randomUUID();
  const file = request.files[0];
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
  const username = request.cookies[COOKIES.name];
  const imageFileName = `${id}${getExtension(file.mimetype)}`;
  const imagePath = path.join(DB_DIR, username, imageFileName);
  const imageDataPath = path.join(DB_DIR, username, `${id}.json`);
  if (!username) {
    throw new Error("No user found. Please log in.");
  }
  await fs.mkdir(path.dirname(imagePath), {
    recursive: true
  });
  await fs.writeFile(imagePath, file.buffer);
  await fs.writeFile(imageDataPath, JSON.stringify({
    id,
    image: imagePath,
    imageData: imageDataPath,
    username,
    content: ""
  }));
  images = null;
  getImages();
  return {
    id,
    suggestions: result
  };
}
async function getImages() {
  if (images) return images;
  const map = /* @__PURE__ */ new Map();
  async function walk(dir) {
    const entries = await fs.readdir(dir, {
      withFileTypes: true
    });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        const jsonText = await fs.readFile(fullPath, "utf8");
        try {
          const data = JSON.parse(jsonText);
          const key = path.basename(entry.name, ".json");
          map.set(key, data);
        } catch (e) {
          console.error(`Invalid JSON in ${fullPath}:`, e.message);
        }
      }
    }
  }
  await walk(DB_DIR);
  return map;
}
async function getImagesByUsername(username) {
  if (!username) {
    throw new Error("No user found. Please log in.");
  }
  const images2 = await getImages();
  const userImages = [];
  for (const [key, value] of images2.entries()) {
    if (value.username === username) {
      userImages.push(value);
    }
  }
  return userImages;
}
async function setImageContent(id, content) {
  if (id && content) {
    const images2 = await getImages();
    if (images2.has(id)) {
      const imageData = images2.get(id);
      if (imageData) {
        imageData.content = content;
        await fs.writeFile(imageData?.imageData, JSON.stringify(imageData, null, 2));
      }
    }
    return {
      ok: true
    };
  } else {
    throw new Error("Image ID and content are required");
  }
}
function getExtension(mimetype) {
  switch (mimetype) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    case "image/svg+xml":
      return ".svg";
    case "image/bmp":
      return ".bmp";
    case "image/tiff":
      return ".tiff";
    case "image/heic":
      return ".heic";
    case "image/heif":
      return ".heif";
    case "image/x-icon":
      return ".ico";
    case "image/avif":
      return ".avif";
    default:
      return "";
  }
}
var db_default = DB;
export {
  db_default as default
};
