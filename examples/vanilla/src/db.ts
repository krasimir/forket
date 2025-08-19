import fs from "fs/promises";
import path from 'path';
import crypto from "crypto";
import { fileURLToPath } from "url";
import { pipeline, env } from "@huggingface/transformers";

import { COOKIES } from "./constants.js";
import { Image, Suggestion } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

env.allowRemoteModels = true;
env.cacheDir = path.normalize(__dirname + "/../../models");

const DB_DIR = path.resolve(__dirname, path.join("..", "..", "db"));

const DB = {
  storeImage,
  getImages,
  getImagesByUsername,
  setImageContent,
  deleteImage
};
let images;

async function storeImage(request): Promise<{ id: string; suggestions: Suggestion[] }> {
  const id = crypto.randomUUID();
  const file = request.files[0];
  if (!file) throw new Error("No file uploaded");

  const classify = await pipeline("image-classification", "Xenova/vit-base-patch16-224");
  const blob = new Blob([file.buffer], { type: "image/jpeg" });
  const result = await classify(blob, { topk: 5 });

  const username = request.cookies[COOKIES.name];
  const imageFileName = `${id}${getExtension(file.mimetype)}`;
  const imagePath = path.join(DB_DIR, username, imageFileName);
  const imageDataPath = path.join(DB_DIR, username, `${id}.json`);

  if (!username) {
    throw new Error("No user found. Please log in.");
  }
  await fs.mkdir(path.dirname(imagePath), { recursive: true });
  await fs.writeFile(imagePath, file.buffer);
  await fs.writeFile(
    imageDataPath,
    JSON.stringify({
      id,
      image: imagePath,
      imageData: imageDataPath,
      username,
      content: ""
    })
  );

  images = null;
  getImages();

  return { id, suggestions: result as Suggestion[] };
}
async function getImages(): Promise<Map<string, Image>> {
  if (images) return images;
  const map = new Map();

  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(".json")) {
        const jsonText = await fs.readFile(fullPath, "utf8");
        try {
          const data = JSON.parse(jsonText);
          const key = path.basename(entry.name, ".json"); // "file.json" -> "file"
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
async function getImagesByUsername(username): Promise<Image[]> {
  if (!username) {
    throw new Error("No user found. Please log in.");
  }
  const images = await getImages();
  const userImages: Image[] = [];
  for (const [key, value] of images.entries()) {
    if (value.username === username) {
      userImages.push(value);
    }
  }
  return userImages;
}
async function setImageContent(id: string, content: string) {
  if (id && content) {
    const images = await getImages();
    if (images.has(id)) {
      const imageData = images.get(id);
      if (imageData) {
        imageData.content = content;
        await fs.writeFile(imageData?.imageData, JSON.stringify(imageData, null, 2));
      } 
    }
    return { ok: true }
  } else {
    throw new Error("Image ID and content are required");
  }
}
async function deleteImage(id: string): Promise<{ ok: boolean }> {
  if (!id) {
    throw new Error("Image ID is required");
  }
  const images = await getImages();
  if (images.has(id)) {
    const imageData = images.get(id);
    if (imageData) {
      await fs.unlink(imageData.image);
      await fs.unlink(imageData.imageData);
      images.delete(id);
      return { ok: true };
    }
  }
  return { ok: false };
}

function getExtension(mimetype): string {
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

export default DB;