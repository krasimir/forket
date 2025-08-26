import fs from "fs";
import path from "path";

import { DEFAULT_OPTIONS } from "../constants.js";

export default async function findConfig(configPath) {
  if (!configPath){
    configPath = path.join(process.cwd(), "forket.config.js");
  }
  while (true) {
    if (fs.existsSync(configPath)) {
      const config = (await import(configPath)).default;
      return { ...DEFAULT_OPTIONS, ...config };
    }
    const dir = path.dirname(configPath);
    const parentDir = path.dirname(dir);
    if (parentDir === dir) {
      throw new Error(`‎𐂐 Forket: missing forket.config.js. Create one at your root directory.`);
    }
    configPath = path.join(parentDir, "forket.config.js");
  }
}
