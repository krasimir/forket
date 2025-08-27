import fs from 'fs';
import path from "path";
import chokidar from "chokidar";
import { fileURLToPath } from "url";
import { build as viteBuild } from "vite";
import Forket from 'forket';
// import Forket from '../../../forket/index.js';
import react from "@vitejs/plugin-react";

import command from "./utils/command.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = process.cwd();
const BUILD = path.normalize(path.join(__dirname, "..", "build"));
const DIST = path.normalize(path.join(__dirname, "..", "dist"));

let serverProcess;
let restart = false;

const forket = await Forket({
  watch: true,
  printGraph: true
});

forket.process().then(async () => {
  await run();
  chokidar.watch(`${BUILD}/**/*`, { ignoreInitial: true }).on("all", async (event, file) => {
    if (!restart) {
      restart = true;
      if (serverProcess) {
        serverProcess.kill();
        command("lsof -ti tcp:24678 | xargs kill -9", ROOT);
      } else {
        run();
      }
    }
  });
});
async function compile() {
  await viteBuild({
    plugins: [react()],
    build: {
      outDir: DIST,
      manifest: true,
      ssrManifest: true,
      sourcemap: true,
      rollupOptions: { input: `${BUILD}/client/client.tsx` }
    }
  });
}
async function run() {
  restart = false;
  await compile();
  serverProcess = command(`node ${path.join(BUILD, "server", "server.js")}`, ROOT, (code) => {
    serverProcess = null;
    if (code === null && restart) {
      run();
    }
  });
};