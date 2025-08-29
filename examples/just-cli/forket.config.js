import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  sourceDir: path.normalize(path.join(__dirname, "src")),
  buildDir: path.normalize(path.join(__dirname, "build")),
  printGraph: true
}

export default config;