import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const algorithm = "aes-256-cbc";
let key = Buffer.from('......', 'hex');
const secretFile = path.join(__dirname, "..", "forket.secret");

if (fs.existsSync(secretFile)) {
  key = Buffer.from(fs.readFileSync(secretFile, "utf-8"), "hex");
}

export function encrypt(text) {
  const iv = crypto.randomBytes(16); // 128-bit IV
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function decrypt(encrypted) {
  const [ivHex, dataHex] = encrypted.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const data = Buffer.from(dataHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return decrypted.toString("utf8");
}
