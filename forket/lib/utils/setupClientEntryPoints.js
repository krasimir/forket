import fs from "fs";
import swc from "@swc/core";
import path from "path";

import exposeGlobal from "../ast/exposeGlobal/index.js";
import insertImports from "./insertImports.js";
import getImportPath from "./getImportPath.js";

export default async function setupClientEntryPoints(
  sourceDir,
  buildDir,
  clientBoundaries,
  clientEntrypoints
) {
  await Promise.all(
    clientEntrypoints.map(async (entryPoint) => {
      clientBoundaries.forEach(({ compNames, importedNode }) => {
        compNames.forEach((compName) => {
          insertImports(entryPoint.ast, compName, getImportPath(entryPoint.file, importedNode.file));
        });
      });
      insertImports(entryPoint.ast, "ReactDOMClient", "react-dom/client");
      insertImports(entryPoint.ast, "React", "react");
      entryPoint.ast.body = entryPoint.ast.body
        .concat(exposeGlobal("React", "React"))
        .concat(exposeGlobal("ReactDOMClient", "ReactDOMClient"))
      clientBoundaries.forEach(({ compNames }) => {
        compNames.forEach((compName) => {
          entryPoint.ast.body = entryPoint.ast.body.concat(exposeGlobal(compName, compName));
        });
      });
      
      // generating and saving the updated version
      const transformed = await swc.print(entryPoint.ast, {
        minify: false
      });
      const newCode = transformed.code;
      const relativePath = path.relative(sourceDir, entryPoint.file);
      const outputFile = path.join(buildDir, relativePath);
      fs.writeFileSync(outputFile, newCode, "utf8");
    })
  );
};
