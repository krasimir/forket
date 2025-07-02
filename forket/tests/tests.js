const fs = require("fs");
const path = require("path");
const chalk = require('chalk');
const arg = require("arg");


let dirs = fs.readdirSync(__dirname)
const args = arg({
  "--spec": String, // "01", "02" or "all"
});
const Forket = require('../index');

(async function () {
  if (args["--spec"] && args["--spec"] !== "all") {
    dirs = dirs.filter(dir => dir.startsWith(args["--spec"] || ""));
  }

  for(let i=0; i<dirs.length; i++) {
    const dir = dirs[i];
    if (fs.statSync(path.join(__dirname, dir)).isDirectory()) {
      const test = require(path.join(__dirname, dir, "test.js"));
      const { transform } = Forket.init();

      try {
        await test({
          transform,
          test(message, condition) {
            if (!condition()) {
              console.log(chalk.red(`❌ ${dir}: ${message}`));
            } else {
              console.log(chalk.green(`✅ ${dir}: ${message}`));
            }
          }
        });
      } catch(err) {
        console.log(chalk.red(`Error transforming ${dir}:`), err);
        continue;
      }
    }
  }
})();