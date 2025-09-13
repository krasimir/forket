import path from "path";
import chalk from "chalk";
import chokidar from "chokidar";
import fs from 'fs';
import { fileURLToPath } from "url";

import findConfig from "./lib/utils/findConfig.js";
import { getGraphs, printGraph } from "./lib/graph.js";
import { copyFolder, clearPath, emptySourceContentCache } from "./lib/utils/fsHelpers.js";
import { setRoles } from "./lib/roles.js";
import { Thanos, MODE } from "./lib/thanos.js";
import annotateClientEntryPoints from "./lib/utils/annotateClientEntryPoints.js";
import setupServerActionsHandler from "./lib/utils/setupServerActionsHandler.js"
import { resetId } from "./lib/utils/getId.js";
import { serveApp, setRenderer, setRequestContext } from "./lib/server/serveApp.js";
import serveServerActions from './lib/server/serveServerActions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8"));

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
    console.log(chalk.gray(`‎𐂐 Watching for changes in ${clearPath(options.sourceDir)}`));
    chokidar.watch(options.sourceDir, { ignoreInitial: true }).on("all", (event, file) => {
      console.log(chalk.gray(`‎𐂐 ${event} ${clearPath(file)} ${inProcess ? 1 : 0}`));
      resetId();
      process();
    });
  }

  resetId();

  async function process() {
    if (inProcess) return;

    inProcess = true;

    try {
      console.log(chalk.greenBright(`‎𐂐 Forket v${pkg.version}`));
      console.log(chalk.cyan(`‎𐂐 Generating graphs ... (${clearPath(options.sourceDir)})`));

      const serverActions = [];
      const graphs = await getGraphs(options.sourceDir);
      graphs.forEach((g) => {
        setRoles(g);
        if (options.printGraph) {
          printGraph(g);
        }
      });

      let thanosServer = Thanos();
      console.log(chalk.cyan(`‎𐂐 Generating server code in ${clearPath(buildServerDir)}`));
      await copyFolder(options.sourceDir, buildServerDir, async (filePath, content) => {
        return await thanosServer.snap(graphs, filePath, content, MODE.SERVER, options, serverActions);
      });

      let thanosClient = Thanos();
      console.log(chalk.cyan(`‎𐂐 Generating client code in ${clearPath(buildClientDir)}`));
      await copyFolder(options.sourceDir, buildClientDir, async (filePath, content) => {
        return await thanosClient.snap(graphs, filePath, content, MODE.CLIENT, options, serverActions);
      });

      console.log(chalk.cyan(`‎𐂐 Annotating client entry point/s`));
      await annotateClientEntryPoints(
        options,
        buildClientDir,
        thanosServer.clientBoundaries,
        thanosClient.clientEntryPoints
      );

      console.log(chalk.cyan(`‎𐂐 Setting up server actions handler (${serverActions.length} action/s)`));
      await setupServerActionsHandler(
        serverActions,
        options.sourceDir,
        path.join(buildServerDir, options.forketServerActionsHandler)
      );

      console.log(chalk.greenBright(`‎𐂐 Processing completed successfully!\n`));
      emptySourceContentCache();
      inProcess = false;
    } catch (err) {
      emptySourceContentCache();
      inProcess = false;
      console.error(chalk.red(`‎𐂐 ${err.message}`), err);
    }
  }

  return {
    process,
    resetId,
    getGraphs,
    printGraph,
    forketServerActions: serveServerActions,
    serveApp(ops) { return serveApp({ ...options, ...ops }); },
    setRenderer,
    setRequestContext
  };
}

