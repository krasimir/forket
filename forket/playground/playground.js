const fs = require('fs');
const swc = require("@swc/core");

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