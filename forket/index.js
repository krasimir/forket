const fs = require("fs");
const path = require('path');
const chalk = require("chalk");
const { getGraphs, printGraph } = require("./lib/graph.js");
const { copyFolder, clearPath } = require("./lib/utils/fsHelpers.js");
const { setRoles } = require('./lib/roles.js')
const { Thanos, MODE } = require("./lib/thanos.js");
const processChunk = require('./lib/server/processChunk.js')

const clientReplacerCode = fs.readFileSync(path.join(__dirname, "lib", "client", "replacer.min.js")).toString("utf8");

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

    const graphs = await getGraphs(options.sourceDir);
    graphs.forEach(setRoles);

    let thanos = Thanos();
    const buildServerDir = path.join(options.buildDir, serverDirName);
    console.log(chalk.gray(`‎𐂐 (2) Forket: generating server code in ${clearPath(buildServerDir)}`));
    await copyFolder(options.sourceDir, buildServerDir, async (filePath, content) => {
      return await thanos.snap(graphs, filePath, content, MODE.SERVER);
    });

    thanos = Thanos();
    const buildClientDir = path.join(options.buildDir, clientDirName);
    console.log(chalk.gray(`‎𐂐 (3) Forket: generating client code in ${clearPath(buildClientDir)}`));
    await copyFolder(options.sourceDir, buildClientDir, async (filePath, content) => {
      return await thanos.snap(graphs, filePath, content, MODE.CLIENT);
    });
  }

  return {
    process,
    getGraphs,
    printGraph
  };
}

module.exports.client = function () {
  return clientReplacerCode;
}
module.exports.processChunk = processChunk;