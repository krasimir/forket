import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import processServerAction from '../../lib/utils/processServerActions.js';
import {getGraph, getNodesContainingServerActions} from "../../lib/graph.js";

import { resetId } from "../../lib/utils/getId.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let cases = ["a", "b", "c", "d", "e"];
cases = ["e"];

export default async function ({ test, toAST, toCode }) {
  await test(`Should properly deal with server actions (${cases.join(', ')})`, async () => {
    for (let i = 0; i < cases.length; i++) {
      let id = 0;
      resetId();
      const entryPoint = path.join(__dirname, cases[i], "code.js");
      const rootNode = await getGraph(entryPoint);
      const serverActionsContainingNodes = getNodesContainingServerActions(rootNode)
      let clientComponents = [];
      if (cases[i] === "e") {
        clientComponents = ["Button"];
      }
      
      const handlers = processServerAction(rootNode, serverActionsContainingNodes, clientComponents);
      
      const code = await toCode(rootNode.ast);
      const expected = fs.readFileSync(path.join(__dirname, cases[i], "expected.js"), "utf8");
      fs.writeFileSync(path.join(__dirname, cases[i], "ast.json"), JSON.stringify(rootNode.ast, null, 2));
      fs.writeFileSync(path.join(__dirname, cases[i], "handlers.json"), JSON.stringify(handlers, null, 2));
      fs.writeFileSync(path.join(__dirname, cases[i], "transformed.js"), code);
      if (code !== expected) {
        console.log(`case ${cases[i]} ->\n----------- Got:\n${code}\n----------- Expected\:\n${expected}`);
        return false;
      }
    }
    return true;
  });
};