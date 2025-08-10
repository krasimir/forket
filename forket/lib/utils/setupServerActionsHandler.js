import fs from "fs";
import path from 'path';
import swc from "@swc/core";
import template from "../ast/serverActionsHandler/index.js";
import createMap from "../ast/createMap/index.js";
import insertImports from "./insertImports.js";
import getImportPath from "./getImportPath.js";
import insertAfterTop from './insertAtTheTop.js'

const ACTION_HANDLER_FILE_NAME = "forketServerActions.js";

export default async function serverActions(actions, sourceDir, buildServerDir) {
  if (actions.length === 0) {
    return;
  }
  const ast = template();
  const mapValues = [];

  actions.forEach((action) => {
    console.log(action);
    mapValues.push([ action.id, action.funcName ]);
    insertImports(
      ast,
      action.funcName,
      getImportPath(path.join(sourceDir, '_.js'), action.filePath) + '.js',
      false
    );
  });
  insertAfterTop(ast, createMap('actions', mapValues))

  const result = await swc.print(ast, {
    minify: false
  });

  fs.writeFileSync(path.join(buildServerDir, ACTION_HANDLER_FILE_NAME), result.code);
}
