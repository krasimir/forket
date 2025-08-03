import fs from "fs";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import chokidar from "chokidar";

import { getGraphs, printGraph } from "./lib/graph.js";
import { copyFolder, clearPath } from "./lib/utils/fsHelpers.js";
import { setRoles } from "./lib/roles.js";
import { Thanos, MODE } from "./lib/thanos.js";
import PC from "./lib/server/processChunk.js";
import setupClientEntryPoints from "./lib/utils/setupClientEntryPoints.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_OPTIONS = {
  serverDirName: "server",
  clientDirName: "client",
  clientCopyableFiles: [ ".css", ".scss", ".sass", ".less", ".styl", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico", ".avif", ".woff", ".woff2", ".ttf", ".otf", ".eot", ".mp3", ".wav", ".ogg", ".mp4", ".webm", ".m4a", ".pdf", ".zip", ".gz", ".tar", ".bz2", ".7z", ".wasm" ]
};

const clientReplacerCode = fs.readFileSync(path.join(__dirname, "lib", "client", "replacer.min.js")).toString("utf8");

export default function Forket(options = {}) {
  if (!options.sourceDir) {
    throw new Error(`‎𐂐 Forket: missing "sourceDir" option. Please provide a source directory to process.`);
  }
  if (!options.buildDir) {
    throw new Error(`‎𐂐 Forket: missing "buildDir" option. Please provide a build directory to output files.`);
  }
  options.serverDirName = options.serverDirName || DEFAULT_OPTIONS.serverDirName;
  options.clientDirName = options.clientDirName || DEFAULT_OPTIONS.clientDirName;
  options.clientCopyableFiles = options.clientCopyableFiles || DEFAULT_OPTIONS.clientCopyableFiles;
  options.watch = typeof options.watch !== 'undefined' ? options.watch : false;
  options.printGraph = typeof options.printGraph !== 'undefined' ? options.printGraph : true;
  let inProcess = false;

  async function process() {
    if (inProcess) return;

    inProcess = true;
    console.log(chalk.cyan(`‎𐂐 Generating the graph. Directory: ${clearPath(options.sourceDir)} ...`));

    const graphs = await getGraphs(options.sourceDir);
    graphs.forEach(g => {
      setRoles(g);
      if (options.printGraph) {
        printGraph(g, "  ");
      }
    });

    let thanosServer = Thanos();
    const buildServerDir = path.join(options.buildDir, options.serverDirName);
    console.log(chalk.cyan(`‎𐂐 Generating server code in ${clearPath(buildServerDir)}`));
    await copyFolder(options.sourceDir, buildServerDir, async (filePath, content) => {
      return await thanosServer.snap(graphs, filePath, content, MODE.SERVER, options);
    });

    let thanosClient = Thanos();
    const buildClientDir = path.join(options.buildDir, options.clientDirName);
    console.log(chalk.cyan(`‎𐂐 Generating client code in ${clearPath(buildClientDir)}`));
    await copyFolder(options.sourceDir, buildClientDir, async (filePath, content) => {
      return await thanosClient.snap(graphs, filePath, content, MODE.CLIENT, options);
    });

    console.log(chalk.cyan(`‎𐂐 Setting up client entry point/s`));
    await setupClientEntryPoints(
      options.sourceDir,
      buildClientDir,
      thanosServer.clientBoundaries,
      thanosClient.clientEntryPoints
    );

    inProcess = false;
  }

  if (options.watch) {
    console.log(chalk.cyan(`‎𐂐 Listening for changes. Directory: ${clearPath(options.sourceDir)}`));
    chokidar.watch(options.sourceDir, { ignoreInitial: true }).on("all", (event, file) => {
      console.log(chalk.gray(`‎𐂐 ${event} ${file}`));
      process();
    });
  }

  return {
    process,
    getGraphs,
    printGraph
  };
}

export function client() {
  return clientReplacerCode;
}
export function processChunk(res) {
  return PC(res);
}