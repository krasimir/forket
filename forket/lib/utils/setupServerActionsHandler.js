import fs from "fs";
import path from 'path';
import swc from "@swc/core";
import template from "../ast/serverActionsHandler/index.js";
import createMap from "../ast/createMap/index.js";
import insertImports from "./insertImports.js";
import getImportPath from "./getImportPath.js";
import insertAfterTop from './insertAtTheTop.js'
import getId from "./getId.js";

export default async function setupServerActionsHandler(actions, sourceDir, filePath) {
  const ast = template();
  const mapValues = [];
 
  actions.forEach((action) => {
    const customName = getId();
    mapValues.push([action.serverActionClientId, customName]);
    const importPath = getImportPath(path.join(sourceDir, "imaginaryFile.js"), action.filePath);
    insertImports(ast, action.funcName, importPath, action.isDefault, customName);
  });
  insertAfterTop(ast, createMap('actions', mapValues))

  const result = await swc.print(ast, {
    minify: false
  });

  fs.writeFileSync(filePath, result.code);
}
