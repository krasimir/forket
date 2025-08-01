import fs from "fs/promises";
import path from "path";
import { createReadStream, createWriteStream } from "fs";
import { pipeline } from "stream/promises";
import pLimit from "p-limit";

const limit = pLimit(10);

export async function copyFolder(src, dest, transformFile) {
  const entries = await fs.readdir(src, { withFileTypes: true });
  await fs.mkdir(dest, { recursive: true });

  const tasks = entries.map((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    return limit(async () => {
      if (entry.isDirectory()) {
        await copyFolder(srcPath, destPath, transformFile);
      } else {
        if (typeof transformFile === "function") {
          const content = await fs.readFile(srcPath);
          const transformed = await transformFile(srcPath, content);
          if (transformed !== false && transformed !== null && transformed !== undefined) {
            await fs.writeFile(destPath, transformed);
          }
        } else {
          await pipeline(createReadStream(srcPath), createWriteStream(destPath));
        }
      }
    });
  });

  await Promise.all(tasks);
}
export function clearPath(path) {
  return path.replace(process.cwd(), "");
}

