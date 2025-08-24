import path from 'path';

export default function getImportPath(fromFile, toFile) {
  let relativePath = path.relative(path.dirname(fromFile), toFile);
  relativePath = relativePath.replace(/\\/g, "/");
  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }
  return relativePath;
}