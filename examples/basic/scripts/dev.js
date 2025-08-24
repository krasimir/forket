import path from "path";
import fs from "fs";
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
const BUILD = path.normalize(path.join(__dirname, "..", "build"));
const DIST = path.normalize(path.join(__dirname, "..", "dist"));

let serverProcess;
let restart = false;

const forket = await Forket({
  watch: true,
  printGraph: true,
});

await forket.process();

// Watching for changes in the build directory, transpile, bundle and restart the server
chokidar.watch(`${BUILD}/**/*`, { ignoreInitial: true }).on("all", (event, file) => {
  // console.log(`‎DEV ${event} ${path.relative(ROOT, file)} ${restart} ${!!serverProcess ? 1 : 0}`);
  if (!restart) {
    restart = true;
    if (serverProcess) {
      serverProcess.kill();
    } else {
      run();
    }
  }
});

run();

async function run() {
  await buildServer();
  await buildClient();
  restart = false;
  serverProcess = command(`node ${path.join(DIST, "server", "server.js")}`, ROOT, (code) => {
    serverProcess = null;
    if (code === null && restart) {
      run();
    }
  });
};

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
    // console.log(`Server files compiled successfully to ${DIST}`);
  } catch (error) {
    console.error(`Error compiling server: ${error.message}`);
  }
}
async function buildClient() {
  try {
    const result = await esbuild.build({
      entryPoints: [path.join(BUILD, "client", "/client.tsx")],
      bundle: true,
      minify: true,
      metafile: true,
      outfile: path.join(DIST, "public", "bundle.js"),
      platform: "browser",
      sourcemap: true,
      plugins: []
    });
    fs.writeFileSync(path.join(DIST, "public", "meta.json"), JSON.stringify(result.metafile, null, 2));
    copyFolder(path.join(BUILD, "client", "assets"), path.join(DIST, "public", "assets"));
    // console.log(`Client files compiled successfully to ${path.join(DIST, "public")}`);
  } catch (error) {
    console.error(`Error compiling client: ${error.message}`);
  }
}