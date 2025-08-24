import fs from 'fs';
import path from "path";
import chokidar from "chokidar";
import { fileURLToPath } from "url";
// import Forket from 'forket';
import Forket from '../../../forket/index.js';

import command from "./utils/command.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = process.cwd();
const BUILD = path.normalize(path.join(__dirname, "..", "build"));

let serverProcess;
let restart = false;

const forket = await Forket({
  watch: true,
  printGraph: true,
});

forket.process().then(run);

chokidar.watch(`${BUILD}/**/*`, { ignoreInitial: true }).on("all", (event, file) => {
  if (!restart) {
    restart = true;
    if (serverProcess) {
      serverProcess.kill();
    } else {
      run();
    }
  }
});

async function run() {
  restart = false;  
  serverProcess = command(`node ${path.join(BUILD, "server", "server.js")}`, ROOT, (code) => {
    serverProcess = null;
    if (code === null && restart) {
      run();
    }
  });
};