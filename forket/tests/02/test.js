import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import processServerAction from '../../lib/utils/processServerActions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let cases = ["a", "b", "c", "d"];
// cases = ["d"];

export default async function ({ test, toAST, toCode }) {
  await test(`Should properly deal with server actions (${cases.join(', ')})`, async () => {
    for (let i = 0; i < cases.length; i++) {
      let id = 0;
      let getId = () => ++id;
      const ast = await toAST(path.join(__dirname, cases[i], "code.js"));
      fs.writeFileSync(path.join(__dirname, cases[i], "ast.json"), JSON.stringify(ast, null, 2));
      const expected = fs.readFileSync(path.join(__dirname, cases[i], "expected.js"), "utf8");
      const handlers = processServerAction(ast, "/path/to/my/file.tsx", getId);
      fs.writeFileSync(path.join(__dirname, cases[i], "handlers.json"), JSON.stringify(handlers, null, 2));
      const code = await toCode(ast);
      fs.writeFileSync(path.join(__dirname, cases[i], "transformed.js"), code);
      if (code !== expected) {
        console.log(`case ${cases[i]} ->\n----------- Got:\n${code}\n----------- Expected\:\n${expected}`);
        return false;
      }
    }
    return true;
  });
};