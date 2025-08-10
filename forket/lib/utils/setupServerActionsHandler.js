import fs from "fs";
import path from 'path';
import swc from "@swc/core";
import template from "../ast/serverActionsHandler/index.js";
import insertImports from "./insertImports.js";
import getImportPath from "./getImportPath.js";

const ACTION_HANDLER_FILE_NAME = "forketServerActions.js";

export default async function serverActions(actions, sourceDir, buildServerDir) {
  if (actions.length === 0) {
    return;
  }
  const ast = template();

  actions.forEach((action) => {
    console.log(action);
    insertImports(
      ast,
      action.funcName,
      getImportPath(path.join(sourceDir, '_.js'), action.filePath),
      false
    );
  });

  const result = await swc.print(ast, {
    minify: false
  });

  fs.writeFileSync(path.join(buildServerDir, ACTION_HANDLER_FILE_NAME), result.code);
}
