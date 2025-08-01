import fs from "fs";
import path from "path";
import chalk from 'chalk';
import arg from "arg";
import swc from "@swc/core";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
      const test = await import(path.join(__dirname, dir, "test.js"));

      try {
        await test.default({
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
          },
          async toAST(filePath) {
            const code = fs.readFileSync(filePath, "utf8");
            const ast = await swc.parse(code, {
              syntax: "typescript", // or 'ecmascript'
              tsx: true,
              decorators: false
            });
            return ast;
          },
          async toCode(ast) {
            const transformed = await swc.print(ast, {
              minify: false
            });
            return transformed.code;
          }
        });
      } catch(err) {
        console.log(chalk.red(`${dir}:`), err);
        continue;
      }
    }
  }
})();