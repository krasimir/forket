export default function insertAtTheTop(ast, node) {
  if (!ast.body) {
    return;
  }
  if (!Array.isArray(node)) {
    node = [node];
  }
  if (ast.body.length > 0) {
    let atIndex = 0;
    for (let i=0; i<ast.body.length; i++) {
      const bodyItem = ast.body[i];
      if (bodyItem.type === "ExpressionStatement" && bodyItem.expression.type === "StringLiteral") {
        atIndex = i+1;
        continue;
      } else if (bodyItem.type === "ImportDeclaration") {
        atIndex = i+1;
        continue;
      } else if (
        bodyItem.type === "VariableDeclaration" &&
        bodyItem?.declarations &&
        bodyItem.declarations.find(d => d?.init?.callee?.value === 'require')
      ) {
        atIndex = i+1;
        continue;
      }
    }
    ast.body = [...ast.body.slice(0, atIndex), ...node, ...ast.body.slice(atIndex)];
  } else {
    ast.body = node.concat(ast.body);
  }
}
