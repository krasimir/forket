module.exports = function exposeReactLibs(ast, reactLibs) {
  if (!ast.body) {
    return;
  }
  ast.body = ast.body.concat(reactLibs);
};
