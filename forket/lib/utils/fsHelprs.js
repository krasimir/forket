const fs = require("fs/promises");
const path = require("path");
const { createReadStream, createWriteStream } = require("fs");
const { pipeline } = require("stream/promises");
const pLimit = require("p-limit");

const limit = pLimit(10);

async function copyFolder(src, dest, transformFile) {
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
          await fs.writeFile(destPath, transformed);
        } else {
          await pipeline(createReadStream(srcPath), createWriteStream(destPath));
        }
      }
    });
  });

  await Promise.all(tasks);
}
function clearPath(path) {
  return path.replace(process.cwd(), "");
}

module.exports = {
  copyFolder,
  clearPath
};
