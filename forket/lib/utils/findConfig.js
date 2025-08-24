import fs from "fs";
import path from "path";

const DEFAULT_OPTIONS = {
  sourceDir: undefined,
  buildDir: undefined,
  serverDirName: "server",
  clientDirName: "client",
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
  printGraph: false,
  exposeReactGlobally: true,
};

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
