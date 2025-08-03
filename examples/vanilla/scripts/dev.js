import path from "path";
import fs from "fs";
import chokidar from "chokidar";
import esbuild from "esbuild";
import { fileURLToPath } from "url";

import command from "./utils/command.js";
import Forket from '../../../forket/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = process.cwd();
const SRC = path.normalize(path.join(__dirname, "..", "src"));
const BUILD = path.normalize(path.join(__dirname, "..", "build"));
const DIST = path.normalize(path.join(__dirname, "..", "dist"));
const SERVER_ENTRY_POINT = path.join(DIST, "build", "server", "server.js");
const CLIENT_BUNDLE = path.join(DIST, "public", "bundle.js");

let serverProcess;
let restart = false; 

await Forket({
  sourceDir: SRC,
  buildDir: BUILD,
  watch: true
}).process();

async function run() {
  await buildServer();
  await buildClient();
  console.log("Starting server...");
  serverProcess = command(`node ${SERVER_ENTRY_POINT}`, ROOT, (code) => {
    serverProcess = null;
    if (code === null && restart) {
      run();
    }
  });
};

chokidar.watch(`${BUILD}/**/*`, { ignoreInitial: true }).on("all", (event, file) => {
  restart = true;
  if (serverProcess) {
    serverProcess.kill();
  } else {
    run();
  }
});

run();

async function buildServer() {
  const files = getAllFiles(path.join(BUILD, "server"));
  try {
    await Promise.all(files.map(async (file) => {
      if (!file.match(/\.(ts|tsx|js|tsx)$/)) {
        return;
      }
      const outfile = path.join(path.join(DIST, 'server'), path.relative(SRC, file).replace(/\.(ts|tsx|js|tsx)$/, ".js"));
      await esbuild.build({
        entryPoints: [file],
        bundle: false,
        outfile,
        platform: "node",
        format: "esm",
        plugins: []
      });
    }));
  } catch (error) {
    console.error(`Error compiling server: ${error.message}`);
  }
}
async function buildClient() {
  try {
    await esbuild.build({
      entryPoints: [path.join(BUILD, "client", "/client.tsx")],
      bundle: true,
      outfile: CLIENT_BUNDLE,
      platform: "browser",
      sourcemap: true,
      plugins: []
    });
  } catch (error) {
    console.error(`Error compiling server: ${error.message}`);
  }
}

// Utilities ------------------------------------------------------
function getAllFiles(dir) {
  const result = [];
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        result.push(fullPath);
      }
    }
  }
  walk(dir);
  return result;
}