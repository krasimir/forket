import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientReplacerCode = fs.readFileSync(path.join(__dirname, "..", "client", "client.min.js")).toString("utf8");

export default function client() {
  let str = clientReplacerCode;
  return str;
}
