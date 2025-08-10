import fs from 'fs';
import swc from "@swc/core";
import path from 'path';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const code = fs.readFileSync(__dirname + '/code.js', 'utf8');

(async function() {
  const { transform, parse, print } = swc;
  const ast = await parse(code, {
    syntax: "typescript", // or 'ecmascript'
    tsx: true,
    decorators: false
  });
  fs.writeFileSync(__dirname + '/ast.json', JSON.stringify(ast, null, 2));
})();