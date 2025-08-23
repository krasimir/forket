import fs from "fs/promises";
import path from "path";
import { VALID_FILES_TO_PROCESS } from "../constants.js";

const cache = new Map();

export async function copyFolder(src, dest, transformFile) {
  const entries = (await fs.readdir(src, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name));
  await fs.mkdir(dest, { recursive: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyFolder(srcPath, destPath, transformFile);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (VALID_FILES_TO_PROCESS.includes(ext)) {
        let content;
        if (cache.has(srcPath)) {
          content = await cache.get(srcPath);
        } else {
          const p = fs.readFile(srcPath);
          cache.set(srcPath, p);
          content = await p;
        }
        const transformed = await transformFile(srcPath, content);
        if (transformed !== false && transformed !== null && transformed !== undefined) {
          let shouldWrite = true;
          try {
            const existing = await fs.readFile(destPath, "utf8");
            if (existing === transformed.toString("utf8")) {
              shouldWrite = false;
            }
          } catch (err) {
            // file doesn’t exist, so we’ll write it
          }
          if (shouldWrite) {
            await fs.writeFile(destPath, transformed.toString("utf8"));
          }
        }
      } else {
        await copyIfChanged(srcPath, destPath);
      }
    }
  }
}
export function clearPath(path) {
  return path.replace(process.cwd(), "");
}
export function emptySourceContentCache() {
  cache.clear();
}
async function copyIfChanged(srcPath, destPath) {
  try {
    const [srcStat, destStat] = await Promise.all([fs.stat(srcPath), fs.stat(destPath)]);

    if (
      srcStat.size === destStat.size &&
      srcStat.mtimeMs <= destStat.mtimeMs
    ) {
      return;
    }
  } catch {
    // dest doesn't exist -> copy
  }
  // console.log(`‎𐂐 Copying ${srcPath}`);
  await fs.copyFile(srcPath, destPath);
}

