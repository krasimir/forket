import fs from "fs/promises";
import path from 'path';
import crypto from "crypto";
import { fileURLToPath } from "url";
import { COOKIES } from "../../constants.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_DIR = path.resolve(__dirname, "../../../../db");
export async function storeImage(context, file) {
    const id = crypto.randomUUID();
    const username = context.request.cookies[COOKIES.name];
    const imagePath = path.join(DB_DIR, username, `${id}${getExtension(file.mimetype)}`);
    const imageDataPath = path.join(DB_DIR, username, `${id}.json`);
    if (!username) {
        throw new Error("No user found. Please log in.");
    }
    await fs.mkdir(path.dirname(imagePath), {
        recursive: true
    });
    await fs.writeFile(imagePath, file.buffer);
    await fs.writeFile(imageDataPath, JSON.stringify({
        content: null
    }));
    return id;
}
function getExtension(mimetype) {
    switch(mimetype){
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
