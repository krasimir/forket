import fs from "fs";
import path from "path";

const DEFAULT_OPTIONS = {
  sourceDir: undefined,
  buildDir: undefined,
  serverDirName: "server",
  clientDirName: "client",
  forketServerActionsEndpoint: "/@forket",
  forketServerActionsHandler: "forketServerActions.js",
  clientCopyableFiles: [
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".styl",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".ico",
    ".avif",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".eot",
    ".mp3",
    ".wav",
    ".ogg",
    ".mp4",
    ".webm",
    ".m4a",
    ".pdf",
    ".zip",
    ".gz",
    ".tar",
    ".bz2",
    ".7z",
    ".wasm"
  ],
  watch: false,
  printGraph: false
};

export default async function findConfig(startDir = process.cwd()) {
  let dir = startDir;

  while (true) {
    const configPath = path.join(dir, "forket.config.js");

    if (fs.existsSync(configPath)) {
      const config = (await import(configPath)).default;
      return { ...DEFAULT_OPTIONS, ...config };
    }

    const parentDir = path.dirname(dir);
    if (parentDir === dir) {
      throw new Error(`‎𐂐 Forket: missing forket.config.js. Create one at your root directory.`);
    }
    dir = parentDir;
  }
}
