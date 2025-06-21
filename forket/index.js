const path = require('path')
const fs = require('fs');
const swc = require("@swc/core");

const POSSIBLE_TYPES = ["server", "client"];

async function transform(code, type, filepath) {
  if (!type || !POSSIBLE_TYPES.includes(type)) {
    throw new Error(`Forket: Invalid type "${type}". Expected one of: ${POSSIBLE_TYPES.join(", ")}`);
  }

  const { transform, parse, print } = swc;
  const ast = await parse(code, {
    syntax: "typescript", // or 'ecmascript'
    tsx: true,
    decorators: false
  });

  fs.writeFileSync(path.join(__dirname, "tmp", path.basename(filepath) + ".input.tsx"), code);
  fs.writeFileSync(path.join(__dirname, 'tmp', path.basename(filepath) + '.ast.json'), JSON.stringify(ast, null, 2));

  const transformed = await transform(ast, {
    jsc: {
      target: "esnext", // "es3" | "es5" | "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "es2021" | "es2022" | "es2023" | "es2024" | "esnext"
      transform: {
        react: {
          runtime: "classic",
          pragma: "React.createElement",
          pragmaFrag: "React.Fragment",
          throwIfNamespace: true,
          development: false,
          useBuiltins: false
        }
      },
      parser: {
        syntax: "typescript", // or 'ecmascript'
        tsx: true,
        decorators: false
      }
    }
  });

  fs.writeFileSync(path.join(__dirname, "tmp", path.basename(filepath) + ".output.tsx"), code);

  return transformed.code;
}

function traverseAST(root) {
  
}

module.exports = { 
  transform
}
