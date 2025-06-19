const path = require('path')
const fs = require('fs');
const swc = require("@swc/core");

async function run() {
  const filename = path.normalize(path.join(__dirname, "tests/01/source.tsx"));
  const dir = path.dirname(filename);

  const code = fs.readFileSync(filename).toString("utf8");
  const { transform, parse, print } = swc;
  const ast = await parse(code, {
    syntax: "typescript", // or 'ecmascript'
    tsx: true,
    decorators: false
  });

  fs.writeFileSync(path.join(dir, "ast.json"), JSON.stringify(ast, null, 2));

  const transformed = await transform(ast, {
    filename,
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
  console.log(transformed.code);
}

run();
