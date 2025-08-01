import fs from "fs";
import swc from "@swc/core";
import path from "path";
import chalk from "chalk";

import exposeGlobal from "../ast/exposeGlobal/index.js";
import insertImports from "./insertImports.js";

export default async function setupClientEntryPoints(sourceDir, buildDir, clientBoundaries, clientEntrypoints) {
  console.log(chalk.gray(`‎𐂐 (4) Setting up client entry point/s`));

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
        .concat(exposeGlobal("ReactDOMClient", "ReactDOMClient"));
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

function getImportPath(fromFile, toFile) {
  let relativePath = path.relative(path.dirname(fromFile), toFile);
  relativePath = relativePath.replace(/\\/g, "/");
  relativePath = relativePath.replace(/\.(tsx?|jsx?|mjs|cjs)$/, "");
  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }
  return relativePath;
}
