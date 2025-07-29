module.exports = function insertAfterImports(ast, node) {
  if (!ast.body) {
    return;
  }
  let detectedImports = false;
  for (let i = 0; i < ast.body.length; i++) {
    const n = ast.body[i];
    if (
      n.type === "ImportDeclaration" ||
      (n.type === "VariableDeclaration" && n?.init?.type === "CallExpression" && n?.init?.callee?.value === "require")
    ) {
      detectedImports = true;
    }
    if (detectedImports && n.type !== "ImportDeclaration") {
      if (Array.isArray(node)) {
        ast.body.splice(i, 0, ...node);
      } else {
        ast.body.splice(i, 0, node);
      }
      return;
    }
  }
  if (!detectedImports) {
    if (Array.isArray(node)) {
      ast.body = node.concat(ast.body);
    } else {
      ast.body.unshift(node);
    }
  } else {
    if (Array.isArray(node)) {
      ast.body = ast.body.concat(node);
    } else {
      ast.body.push(node);
    }
  }
};