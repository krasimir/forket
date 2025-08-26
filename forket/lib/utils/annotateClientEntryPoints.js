import fs from "fs";
import swc from "@swc/core";
import path from "path";
import chalk from "chalk";

import exposeGlobal from "../ast/exposeGlobal/index.js";
import insertImports from "./insertImports.js";
import getImportPath from "./getImportPath.js";
import { clearPath } from "./fsHelpers.js";
import serveClient from "../server/serveClient.js"

export default async function setupClientEntryPoints(
  options,
  buildDir,
  clientBoundaries,
  clientEntrypoints,
) {
  const { sourceDir, exposeReactGlobally, serverActionsEndpoint } = options;
  if (clientEntrypoints.length === 0) {
    throw new Error(`No client entry points found. Make sure that you have at least one file in your root directory with "use client" directive.`);
  }
  await Promise.all(
    clientEntrypoints.map(async (entryPoint) => {
      console.log(chalk.green("└─ " + clearPath(entryPoint.file)));
      clientBoundaries.forEach(({ components, importedNode }) => {
        components.forEach(({ id, compName }) => {
          console.log(chalk.gray("   └─ <" + compName + ">"));
          insertImports(entryPoint.ast, id, getImportPath(entryPoint.file, importedNode.file));
        });
      });
      if (exposeReactGlobally) {
        insertImports(entryPoint.ast, "React", "react");
        insertImports(entryPoint.ast, "ReactDomClient", "react-dom/client");
      }
      clientBoundaries.forEach(({ components }) => {
        components.forEach(({ id }) => {
          entryPoint.ast.body = entryPoint.ast.body.concat(exposeGlobal(`$${id}`, id));
        });
      });

      // generating and saving the updated version
      const transformed = await swc.print(entryPoint.ast, {
        minify: false
      });
      let newCode = transformed.code;

      newCode += "\n/* FORKET CLIENT */\n// @ts-ignore\n";
      newCode += serveClient(serverActionsEndpoint);

      const relativePath = path.relative(sourceDir, entryPoint.file);
      const outputFile = path.join(buildDir, relativePath);
      fs.writeFileSync(outputFile, newCode, "utf8");
    })
  );
};
