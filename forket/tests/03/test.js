import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import chalk from "chalk";

import Forket from '../../index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "..", "package.json"), "utf8"));
let cases = ["a", "b", "c"];
// cases = ["b"];

export default async function ({ test, toAST, toCode }) {
  await test(`Should properly transform source code (${cases.join(', ')})`, async () => {
    let pass = true;
    for (let i = 0; i < cases.length; i++) {
      const buildDir = path.join(__dirname, cases[i], "build");
      const expectedDir = path.join(__dirname, cases[i], "expected");
      // running forket
      await clearDirectory(buildDir);
      const forket = await Forket({ printGraph: false }, path.join(__dirname, cases[i], "forket.config.js"));
      await forket.process();
      traverseTree(readFileTree(buildDir), (file) => {
        const dir = path.dirname(file);
        const expectedFile = path.join(expectedDir, dir.replace(buildDir, ""), path.basename(file));
        if (!fs.existsSync(expectedFile)) {
          createFileSync(expectedFile, "");
        }
        const actual = fs.readFileSync(file, "utf-8");
        const expected = fs.readFileSync(expectedFile, "utf-8").replace(/v\d+\.\d+\.\d+/, 'v' + pkg.version);
        if (actual !== expected) {
          console.log(chalk.red(`--> ${expectedFile.replace(__dirname, "")} does not match expected output.`));
          // console.log(chalk.green("Actual:\n", actual));
          // console.log(chalk.red("Expected:\n", expected));
          pass = false;
        }
      });
    }
    return pass;
  });
};

function readFileTree(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  const tree = {};
  for (const file of files) {
    if (file.isDirectory()) {
      tree[file.name] = readFileTree(path.join(dir, file.name));
    } else {
      tree[file.name] = path.join(dir, file.name);
    }
  }
  return tree;
}
function traverseTree(tree, visitor) {
  for (const key in tree) {
    if (typeof tree[key] === 'object') {
      traverseTree(tree[key], visitor);
    } else {
      visitor(tree[key], key);
    }
  }
}
async function clearDirectory(dirPath) {
  try {
    const files = await fs.promises.readdir(dirPath);
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.promises.lstat(filePath);
      if (stat.isDirectory()) {
        await clearDirectory(filePath);
        await fs.promises.rmdir(filePath);
      } else {
        await fs.promises.unlink(filePath);
      }
    }
  } catch (err) {
    console.error(`Error while clearing directory ${dirPath}:`, err);
  }
}
function createFileSync(filePath, content = "") {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, content, "utf8");
}