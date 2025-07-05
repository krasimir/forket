const path = require('path');
const chalk = require("chalk");
const { buildGraphs, printGraph } = require("./lib/graph.js");
const { copyFolder, clearPath } = require("./lib/utils/fsHelprs.js");

module.exports = function (options = {}) {
  if (!options.sourceDir) {
    throw new Error(`‎𐂐 Forket: missing "sourceDir" option. Please provide a source directory to process.`);
  }
  if (!options.buildDir) {
    throw new Error(`‎𐂐 Forket: missing "buildDir" option. Please provide a build directory to output files.`);
  }
  const serverDirName = options.serverDirName || "server";
  const clientDirName = options.clientDirName || "client";

  async function process() {
    console.log(chalk.gray(`‎𐂐 (1) Forket: processing ${clearPath(options.sourceDir)} ...`));

    const graphs = await buildGraphs(options.sourceDir);
    // graphs.forEach(node => printGraph(node, ''));

    const buildServerDir = path.join(options.buildDir, serverDirName);
    console.log(chalk.gray(`‎𐂐 (2) Forket: generating server code in ${clearPath(buildServerDir)}`));
    await copyFolder(options.sourceDir, buildServerDir, async (filePath, content) => {
      return content;
    });
    const buildClientDir = path.join(options.buildDir, clientDirName);
    console.log(chalk.gray(`‎𐂐 (3) Forket: generating client code in ${clearPath(buildClientDir)}`));
    await copyFolder(options.sourceDir, buildClientDir, async (filePath, content) => {
      return content;
    });
  }

  return {
    process,
    buildGraphs,
    printGraph
  };
}
