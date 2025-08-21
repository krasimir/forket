import fs from "fs";
import { PassThrough } from "node:stream";
import path from "path";
import chalk from "chalk";
import { fileURLToPath } from "url";
import chokidar from "chokidar";
import { renderToPipeableStream } from "react-dom/server";

import findConfig from "./lib/utils/findConfig.js";
import { getGraphs, printGraph } from "./lib/graph.js";
import { copyFolder, clearPath } from "./lib/utils/fsHelpers.js";
import { setRoles } from "./lib/roles.js";
import { Thanos, MODE } from "./lib/thanos.js";
import setupClientEntryPoints from "./lib/utils/setupClientEntryPoints.js";
import setupServerActionsHandler from "./lib/utils/setupServerActionsHandler.js"
import { resetId } from "./lib/utils/getId.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let renderer = renderToPipeableStream;

const clientReplacerCode = fs.readFileSync(path.join(__dirname, "lib", "client", "client.min.js")).toString("utf8");

export default async function Forket(customOptions = {}) {
  let options = await findConfig();
  options = { ...options, ...customOptions };

  if (!options.sourceDir) {
    throw new Error(`‎𐂐 Forket: missing "sourceDir" option. Please provide a source directory to process.`);
  }
  if (!options.buildDir) {
    throw new Error(`‎𐂐 Forket: missing "buildDir" option. Please provide a build directory to output files.`);
  }

  const buildServerDir = path.join(options.buildDir, options.serverDirName);
  const buildClientDir = path.join(options.buildDir, options.clientDirName);
  let inProcess = false;

  // Watching mode
  if (options.watch) {
    console.log(chalk.cyan(`‎𐂐 Listening for changes. Directory: ${clearPath(options.sourceDir)}`));
    chokidar.watch(options.sourceDir, { ignoreInitial: true }).on("all", (event, file) => {
      console.log(chalk.gray(`‎𐂐 ${event} ${file}`));
      resetId();
      process();
    });
  }

  async function process() {
    if (inProcess) return;

    inProcess = true;

    try {
      console.log(chalk.cyan(`‎𐂐 Generating the graph. Directory: ${clearPath(options.sourceDir)} ...`));

      const graphs = await getGraphs(options.sourceDir);
      graphs.forEach((g) => {
        setRoles(g);
        if (options.printGraph) {
          printGraph(g, "  ");
        }
      });

      let thanosServer = Thanos();
      console.log(chalk.cyan(`‎𐂐 Generating server code in ${clearPath(buildServerDir)}`));
      await copyFolder(options.sourceDir, buildServerDir, async (filePath, content) => {
        return await thanosServer.snap(graphs, filePath, content, MODE.SERVER, options);
      });

      let thanosClient = Thanos();
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

      console.log(chalk.cyan(`‎𐂐 Setting up server actions handler`));
      await setupServerActionsHandler(
        thanosServer.serverActions,
        options.sourceDir,
        path.join(buildServerDir, options.forketServerActionsHandler)
      );

      inProcess = false;

    } catch(err) {
      inProcess = false;
      console.error(chalk.red(`‎𐂐 Error during processing: ${err.message}`));
    }
  }
  function client(serverActionsEndpoint, options = { enableLogging: true }) {
    let str = clientReplacerCode;
    str = str.replace(/__FORKET_SERVER_ACTIONS_ENDPOINT__/g, serverActionsEndpoint);
    str = str.replace(/__ENABLE_LOGGIGN__/g, options?.enableLogging ? "1" : "0");
    return str;
  }
  function forketServerActions(handler) {
    if (!handler) {
      throw new Error(`‎𐂐 Forket: something is wrong with the server actions handler. Check your server entry point.`);
    }
    return handler;
  }
  function serveApp(options) {
    if (!options) {
      throw new Error(`‎𐂐 Forket: serveApp requires options object with "factory" and "serverActionsEndpoint" properties.`);
    }
    if (typeof options.factory !== "function") {
      throw new Error(`‎𐂐 Forket: serveApp requires "factory" to be a function. Received ${typeof options.factory}`);
    }
    if (typeof options.serverActionsEndpoint !== "string") {
      throw new Error(`‎𐂐 Forket: serveApp requires "serverActionsEndpoint" to be a string. Received ${typeof options.serverActionsEndpoint}`);
    }
    const { factory, serverActionsEndpoint } = options;

    return (req, res) => {
      const reactStream = new PassThrough();
      let reactEnded = false;

      reactStream.pipe(res, { end: false });
      reactStream.on("end", () => {
        reactEnded = true;
        maybeEnd();
      });

      const pending = new Set();

      function maybeEnd() {
        if (reactEnded && pending.size === 0 && !res.writableEnded) {
          res.end();
        }
      }

      const { pipe, abort } = renderer(factory(req), {
        bootstrapScriptContent: client(serverActionsEndpoint),
        onShellReady() {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          pipe(reactStream);
        },
        onAllReady() {
          
        },
        onError(err) {
          console.error(err);
        }
      });

      res.on("close", () => {
        try {
          abort();
        } catch {}
        try {
          reactStream.end();
        } catch {}
      });
    }
  }
  function setRenderer(r) {
    if (typeof r !== "function") {
      throw new Error(`‎𐂐 Forket: renderer must be a function. Received ${typeof r}`);
    }
    renderer = r;
  }

  return {
    process,
    getGraphs,
    printGraph,
    client,
    forketServerActions,
    serveApp,
    setRenderer
  };
}

