const defineModuleSystem = require("./defineModuleSystem");
const importCommonJS = require("../ast/importCommonJS");
const importESM = require("../ast/importESM");

function insert(ast, node) {
  if (!ast.body) {
    return;
  }
  if (!Array.isArray(node)) {
    node = [node];
  }
  if (
    ast.body.length > 0 &&
    ast.body[0].type === "ExpressionStatement" &&
    ast.body[0].expression.type === "StringLiteral"
  ) {
    const rest = ast.body.slice(1);
    ast.body = [ast.body[0]].concat(node).concat(rest);
  } else {
    ast.body = node.concat(ast.body);
  }
}

module.exports = function insertImports(ast, what, where) {
  if (defineModuleSystem(ast) === "commonjs") {
    insert(ast, importCommonJS(what, where));
  } else {
    insert(ast, importESM(what, where));
  }
};
