import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BUILD = path.normalize(path.join(__dirname, "..", "build"));
export const DIST = path.normalize(path.join(__dirname, "..", "dist"));
