import path from 'path';

export default function getImportPath(fromFile, toFile) {
  let relativePath = path.relative(path.dirname(fromFile), toFile);
  relativePath = relativePath.replace(/\\/g, "/");
  relativePath = relativePath.replace(/\.(tsx?|jsx?|mjs|cjs)$/, "");
  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }
  return relativePath;
}