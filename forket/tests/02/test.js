import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { processServerActions } from "../../lib/utils/processServerActions.js";
import { getGraph, getNodesContainingServerActions, printGraph } from "../../lib/graph.js";

import { resetId } from "../../lib/utils/getId.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let cases = ["a", "b", "c", "d", "e", "f", "g", "h"];
// cases = ["h"];

export default async function ({ test, toAST, toCode }) {
  await test(`Should properly deal with server actions (${cases.join(', ')})`, async () => {
    for (let i = 0; i < cases.length; i++) {
      resetId();
      const entryPoint = path.join(__dirname, cases[i], "code.js");
      const rootNode = await getGraph(entryPoint);
      // printGraph(rootNode);
      const serverActionsContainingNodes = getNodesContainingServerActions(rootNode)
      
      const actions = [];
      processServerActions(rootNode, serverActionsContainingNodes, actions);
      
      const code = await toCode(rootNode.ast);
      const expected = fs.readFileSync(path.join(__dirname, cases[i], "expected.js"), "utf8");
      fs.writeFileSync(path.join(__dirname, cases[i], "ast.json"), JSON.stringify(rootNode.ast, null, 2));
      fs.writeFileSync(
        path.join(__dirname, cases[i], "handlers.json"),
        JSON.stringify(maskHandlersFilePaths(actions), null, 2)
      );
      fs.writeFileSync(path.join(__dirname, cases[i], "transformed.js"), code);
      if (code !== expected) {
        console.log(`case ${cases[i]} ->\n----------- Got:\n${code}\n----------- Expected\:\n${expected}`);
        return false;
      }
    }
    return true;
  });
};

function maskHandlersFilePaths(actions) {
  return actions.map((action) => {
    return {
      ...action,
      filePath: action.filePath.replace(__dirname, "")
    };
  });
}