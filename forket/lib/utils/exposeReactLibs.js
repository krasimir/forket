const reactLibs = require('../ast/exposeReact');

module.exports = function exposeReactLibs(ast) {
  if (!ast.body) {
    return;
  }
  ast.body = ast.body.concat(reactLibs());
};
