const fs = require("fs");
const swc = require("@swc/core");
const path = require("path");
const chalk = require("chalk");

const getReactInScopeCommonJS = require("../ast/reactInScopeCommonJS");
const getReactInScopeESM = require("../ast/reactInScopeESM");
const defineModuleSystem = require("../utils/defineModuleSystem");
const exposeReactLibs = require("../utils/exposeReactLibs.js");
const insertImports = require("./insertImports");

module.exports = async function setupClientEntryPoints(sourceDir, buildDir, clientBoundaries, clientEntrypoints) {
  console.log(chalk.gray(`‎𐂐 (4) Setting up client entry point/s`));

  await Promise.all(
    clientEntrypoints.map(async (entryPoint) => {
      if (defineModuleSystem(entryPoint.ast) === "commonjs") {
        insertImports(entryPoint.ast, getReactInScopeCommonJS());
      } else {
        insertImports(entryPoint.ast, getReactInScopeESM());
      }
      exposeReactLibs(entryPoint.ast);
      clientBoundaries.forEach(boundary => {
        console.log(getImportPath(entryPoint.file, boundary.file));
      })
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

/*
console.log(chalk.yellow("  - Client entry point: " + node.file));

*/
