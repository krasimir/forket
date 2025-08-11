import fs from "fs";
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
import PC from "./lib/server/processChunk.js";
import setupClientEntryPoints from "./lib/utils/setupClientEntryPoints.js";
import setupServerActionsHandler from "./lib/utils/setupServerActionsHandler.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientReplacerCode = fs.readFileSync(path.join(__dirname, "lib", "client", "replacer.min.js")).toString("utf8");

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
  }

  // Watching mode
  if (options.watch) {
    console.log(chalk.cyan(`‎𐂐 Listening for changes. Directory: ${clearPath(options.sourceDir)}`));
    chokidar.watch(options.sourceDir, { ignoreInitial: true }).on("all", (event, file) => {
      console.log(chalk.gray(`‎𐂐 ${event} ${file}`));
      process();
    });
  }

  function client() {
    if (!options.forketServerActionsEndpoint) {
      throw new Error(
        `‎𐂐 Forket: missing "serverActionsEndpoint" parameter. Please provide a server actions endpoint.`
      );
    }
    let str = clientReplacerCode;
    str = str.replace("{@}", options.forketServerActionsEndpoint);
    return str;
  }
  function processChunk(res) {
    return PC(res);
  }
  async function setupForketSA(app, handler) {
    if (!handler) {
      throw new Error(`‎𐂐 Forket: something is wrong with the server actions handler. Check your server entry point.`);
    }
    app.use(options.forketServerActionsEndpoint, handler);
  }
  function setupApp(app, rootPath, rootElementFactory) {
    app.get(rootPath, (req, res) => {
      const { pipe, abort } = renderToPipeableStream(rootElementFactory(req), {
        bootstrapScriptContent: client(),
        onShellReady() {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          processChunk(res);
          pipe(res);
        },
        onError(err) {
          console.error(err);
        }
      });
    });
  }

  return {
    process,
    getGraphs,
    printGraph,
    client,
    processChunk,
    setupForketSA,
    setupApp
  };
}

