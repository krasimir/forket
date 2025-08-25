import fs from "fs";
import swc from "@swc/core";
import path from "path";
import chalk from "chalk";

import exposeGlobal from "../ast/exposeGlobal/index.js";
import initClientCode from "../ast/initClientCode/index.js";
import insertImports from "./insertImports.js";
import getImportPath from "./getImportPath.js";
import { clearPath } from "./fsHelpers.js";

export default async function setupClientEntryPoints(
  sourceDir,
  buildDir,
  clientBoundaries,
  clientEntrypoints,
  exposeReactGlobally = true
) {
  if (clientEntrypoints.length === 0) {
    throw new Error(`No client entry points found. Make sure that you have at least one file in your root directory with "use client" directive.`);
  }
  await Promise.all(
    clientEntrypoints.map(async (entryPoint) => {
      console.log(chalk.green("└─ " + clearPath(entryPoint.file)));
      clientBoundaries.forEach(({ compNames, importedNode }) => {
        compNames.forEach((compName) => {
          console.log(chalk.gray("   └─ <" + compName + ">"));
          insertImports(entryPoint.ast, compName, getImportPath(entryPoint.file, importedNode.file));
        });
      });
      if (exposeReactGlobally) {
        insertImports(entryPoint.ast, "ReactDOMClient", "react-dom/client");
        insertImports(entryPoint.ast, "React", "react");
        entryPoint.ast.body = entryPoint.ast.body
          .concat(exposeGlobal("React", "React"))
          .concat(exposeGlobal("ReactDOMClient", "ReactDOMClient"));
      }
      checkForDuplicates(clientBoundaries);
      clientBoundaries.forEach(({ compNames }) => {
        compNames.forEach((compName) => {
          entryPoint.ast.body = entryPoint.ast.body.concat(exposeGlobal(compName, compName));
        });
      });
      entryPoint.ast.body.push(initClientCode()[0]);

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

function checkForDuplicates(clientBoundaries) {
  let foundDuplicates = [];
  const alreadyThere = [];
  clientBoundaries.forEach(boundary => {
    boundary.compNames.forEach((cn) => {
      if (alreadyThere.includes(cn)) {
        foundDuplicates.push([
          clientBoundaries
            .filter((b) => b.compNames.includes(cn))
            .map((b) => "    " + clearPath(b.importedNode.file))
            .join("\n"),
          cn
        ]);
      } else {
        alreadyThere.push(cn);
      }
    });
  })
  if (foundDuplicates.length > 0) {
    let message = "Duplicate component names found in client boundaries:\n";
    foundDuplicates.forEach(fd => {
      message += ` - <${fd[1]}> defined in\n${fd[0]}\n`;
    });
    throw new Error(message + "Component names must be unique across all client boundaries.`");
  }
}
