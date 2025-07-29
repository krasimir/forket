const path = require("path");
const chalk = require("chalk");

module.exports = function injectClientBoundaries(clientBoundaries, clientEntrypoints) {
  console.log(
    chalk.gray(
      `‎𐂐 (4) Injecting client boundaries (${clientBoundaries.length}) into client entrypoints (${clientEntrypoints.length}).`
    )
  );

  clientEntrypoints.forEach(entryPoint => {
    clientBoundaries.forEach(boundary => {
      console.log(getImportPath(entryPoint.file, boundary.file));
    })
  })
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