import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import DB from '../db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function serveImage(req, res) {
  const id = req.params.id;
  const images = await DB.getImages();
  if (!id) {
    res.status(400).send("Image ID is required");
    return;
  }
  if (!images.has(id)) {
    res.status(404).send("Image not found");
    return;
  }
  const { image } = images.get(id);
  res.sendFile(image, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(err.statusCode || 500).end();
    }
  });
}
