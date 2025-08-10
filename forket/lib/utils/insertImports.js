import defineModuleSystem from "./defineModuleSystem.js";
import importCommonJS from "../ast/importCommonJS/index.js";
import importCommonJSDestruct from "../ast/importCommonJSDestruct/index.js";
import importESM from "../ast/importESM/index.js";

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

export default function insertImports(ast, what, where, defaultExport = true) {
  if (defineModuleSystem(ast) === "commonjs") {
    if (defaultExport) {
      insert(ast, importCommonJS(what, where));
    } else {
      insert(ast, importCommonJSDestruct(what, where));
    }
  } else {
    insert(ast, importESM(what, where, defaultExport ? "ImportDefaultSpecifier" : "ImportSpecifier"));
  }
};
