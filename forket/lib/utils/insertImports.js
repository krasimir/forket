module.exports = function insertImports(ast, node) {
  if (!ast.body) {
    return;
  }
  if (!Array.isArray(ast.body)) {
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
};