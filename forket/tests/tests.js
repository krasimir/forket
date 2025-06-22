const fs = require("fs");
const path = require("path");
const chalk = require('chalk');
const arg = require("arg");

let dirs = fs.readdirSync(__dirname)
const args = arg({
  "--spec": String, // "01", "02" or "all"
  "--type": String // "server" or "client" (if not provided both will be tested)
});
const Forket = require('../index');

(async function () {
  if (args["--spec"] && args["--spec"] !== "all") {
    dirs = dirs.filter(dir => dir.startsWith(args["--spec"] || ""));
  }
  const testServer = !args["--type"] || args["--type"] === "server";
  const testClient = !args["--type"] || args["--type"] === "client";

  for(let i=0; i<dirs.length; i++) {
    const dir = dirs[i];
    if (fs.statSync(path.join(__dirname, dir)).isDirectory()) {
      const inputFile = path.join(__dirname, dir, "input.js");
      const input = fs.readFileSync(inputFile, "utf8");
      const { transform } = Forket.init();

      try {

        if (testClient) {
          const outputClient = fs.readFileSync(path.join(__dirname, dir, "expected_client.js"), "utf8");
          const outputClientGenerated = await transform(input, "client", inputFile, true);
          if (outputClientGenerated !== outputClient) {
            console.log(chalk.red(`Error: Output for client in ${dir} does not match expected output.`));
            console.log(chalk.red(`---- Expected:\n${outputClient}\n---- Generated:\n${outputClientGenerated}`));
          } else {
            console.log(chalk.green(`Client transformation for ${dir} passed.`));
          }
        }

        if (testServer) {
          const outputServer = fs.readFileSync(path.join(__dirname, dir, "expected_server.js"), "utf8");
          const outputServerGenerated = await transform(input, "server", inputFile, true);
          if (outputServerGenerated !== outputServer) {
            console.log(chalk.red(`Error: Output for server in ${dir} does not match expected output.`));
            console.log(chalk.red(`---- Expected:\n${outputServer}\n---- Generated:\n${outputServerGenerated}`));
          } else {
            console.log(chalk.green(`Server transformation for ${dir} passed.`));
          }
        }

      } catch(err) {
        console.log(chalk.red(`Error transforming ${dir}:`), err);
        continue;
      }
    }
  }
})();