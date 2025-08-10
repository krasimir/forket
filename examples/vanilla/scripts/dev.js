import path from "path";
import chokidar from "chokidar";
import esbuild from "esbuild";
import { fileURLToPath } from "url";
// import Forket from 'forket';
import Forket from '../../../forket/index.js';

import command from "./utils/command.js";
import getAllFiles from "./utils/getAllFiles.js";
import copyFolder from './utils/copyFolder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = process.cwd();
const SRC = path.normalize(path.join(__dirname, "..", "src"));
const BUILD = path.normalize(path.join(__dirname, "..", "build"));
const DIST = path.normalize(path.join(__dirname, "..", "dist"));

let serverProcess;
let restart = false; 

await Forket({
  sourceDir: SRC,
  buildDir: BUILD,
  watch: true // important in dev mode
}).process();

async function run() {
  await buildServer();
  await buildClient();
  serverProcess = command(`node ${path.join(DIST, "server", "server.js")}`, ROOT, (code) => {
    serverProcess = null;
    if (code === null && restart) {
      run();
    }
  });
};

// Watching for changes in the build directory, transpile, bundle and restart the server
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
  const serverBuildDir = path.join(BUILD, "server");;
  const files = getAllFiles(serverBuildDir);
  try {
    await Promise.all(files.map(async (file) => {
      if (!file.match(/\.(ts|tsx|js|tsx)$/)) {
        return;
      }
      const outfile = path.join(DIST, file.replace(BUILD, "").replace(/\.(ts|tsx|js|tsx)$/, ".js"));
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
      outfile: path.join(DIST, "public", "bundle.js"),
      platform: "browser",
      sourcemap: true,
      plugins: []
    });
    copyFolder(path.join(BUILD, "client", "assets"), path.join(DIST, "public", "assets"));
  } catch (error) {
    console.error(`Error compiling server: ${error.message}`);
  }
}