import path from "path";
import chalk from "chalk";
import chokidar from "chokidar";

import findConfig from "./lib/utils/findConfig.js";
import { getGraphs, printGraph } from "./lib/graph.js";
import { copyFolder, clearPath } from "./lib/utils/fsHelpers.js";
import { setRoles } from "./lib/roles.js";
import { Thanos, MODE } from "./lib/thanos.js";
import setupClientEntryPoints from "./lib/utils/setupClientEntryPoints.js";
import setupServerActionsHandler from "./lib/utils/setupServerActionsHandler.js"
import { resetId } from "./lib/utils/getId.js";
import { serveApp, setRenderer, setRequestContext } from "./lib/server/serveApp.js";
import serveServerActions from './lib/server/serveServerActions.js';

export default async function Forket(customOptions = {}, configPath = null) {
  let options = await findConfig(configPath);
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

  resetId();

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
    } catch (err) {
      inProcess = false;
      console.error(chalk.red(`‎𐂐 Error during processing: ${err.message}`));
    }
  }

  return {
    process,
    resetId,
    getGraphs,
    printGraph,
    forketServerActions: serveServerActions,
    serveApp,
    setRenderer,
    setRequestContext
  };
}

