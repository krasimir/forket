const fs = require("fs");
const path = require("path");
const chalk = require('chalk');
const arg = require("arg");

let dirs = fs.readdirSync(__dirname)
const args = arg({
  "--spec": String, // "01", "02" or "all"
  "--case": String // "all" or specific case like "01_case1"
});

(async function () {
  if (args["--spec"] && args["--spec"] !== "all") {
    dirs = dirs.filter(dir => dir.startsWith(args["--spec"] || ""));
  }

  for(let i=0; i<dirs.length; i++) {
    const dir = dirs[i];
    if (fs.statSync(path.join(__dirname, dir)).isDirectory()) {
      const test = require(path.join(__dirname, dir, "test.js"));

      try {
        await test({
          testCase: args["--case"] || 'all',
          async test(message, condition) {
            console.log(chalk.gray(`⏳ ${message}`));
            if (!(await condition())) {
              console.log(chalk.red(`❌ ${message}`));
            } else {
              console.log(chalk.green(`✅ ${message}`));
            }
          },
          xtest(message) {
            console.log(chalk.yellow(`❗️ ${message} (skipped)`));
          }
        });
      } catch(err) {
        console.log(chalk.red(`Error transforming ${dir}:`), err);
        continue;
      }
    }
  }
})();