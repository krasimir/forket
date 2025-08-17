import fs from "fs/promises";
import path from 'path';
import crypto from "crypto";
import { fileURLToPath } from "url";

import { COOKIES } from "./constants.js";
import { Image } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.resolve(__dirname, path.join("..", "..", "db"));

const DB = {
  storeImage,
  getImages,
  getImagesByUsername
};
let images;

async function storeImage(context, file): Promise<string> {
  const id = crypto.randomUUID();
  const username = context.request.cookies[COOKIES.name];
  const imageFileName = `${id}${getExtension(file.mimetype)}`;
  const imagePath = path.join(DB_DIR, username, imageFileName);
  const imageDataPath = path.join(DB_DIR, username, `${id}.json`);

  if (!username) {
    throw new Error("No user found. Please log in.");
  }
  await fs.mkdir(path.dirname(imagePath), { recursive: true });
  await fs.writeFile(imagePath, file.buffer);
  await fs.writeFile(imageDataPath, JSON.stringify({
    id,
    image: imagePath,
    username,
    content: ""
  }));
  
  images = null;
  getImages();

  return id;
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