import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const secretFilePath = path.join(__dirname, "..", "lib", "forket.secret");

try {
  const secret = crypto.randomBytes(32).toString("hex");
  fs.writeFileSync(secretFilePath, secret, { encoding: "utf8" });
  console.log(
    `Forket postinstall script created successfully a new secret.`
  );
} catch (error) {
  console.log(
    `Forket postinstall script couldn't create a new secret in ${secretFilePath}. That's not that much of a problem but just in case run "node scripts/postinstall.js" manually.`
  );
}
