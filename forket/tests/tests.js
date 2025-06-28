const fs = require("fs");
const path = require("path");
const chalk = require('chalk');
const arg = require("arg");
const del = require("del");


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

  for(let i=0; i<dirs.length; i++) {
    const dir = dirs[i];
    if (fs.statSync(path.join(__dirname, dir)).isDirectory()) {
      const inputFile = path.join(__dirname, dir, "src", "input.js");
      const test = require(path.join(__dirname, dir, "test.js"));
      const input = fs.readFileSync(inputFile, "utf8");
      const tmp = path.join(__dirname, dir, "src", "tmp");
      const { transform } = Forket.init();

      try {
        if (fs.existsSync(tmp)) {
          del.sync([tmp + "/**"]);
        }
        await transform(input, "client", inputFile, true);
        await transform(input, "server", inputFile, true);
        test({
          assert(condition, message) {
            if (!condition()) {
              console.log(chalk.red(`❌ ${dir}: ${message}`));
            } else {
              console.log(chalk.green(`✅ ${dir}: ${message}`));
            }
          },
          server: readTestResult(path.join(tmp, "server")),
          client: readTestResult(path.join(tmp, "client"))
        });
      } catch(err) {
        console.log(chalk.red(`Error transforming ${dir}:`), err);
        continue;
      }
    }
  }
})();

function readTestResult(dir) {
  return {
    ast: JSON.parse(fs.readFileSync(path.join(dir, "ast.json"), "utf8")),
    astTransformed: JSON.parse(fs.readFileSync(path.join(dir, "ast.transformed.json"), "utf8")),
    input: fs.readFileSync(path.join(dir, "input.js"), "utf8"),
    output: fs.readFileSync(path.join(dir, "output.js"), "utf8"),
    meta: JSON.parse(fs.readFileSync(path.join(dir, "meta.json"), "utf8"))
  }
}