import defineModuleSystem from "./defineModuleSystem.js";
import importCommonJS from "../ast/importCommonJS/index.js";
import importCommonJSDestruct from "../ast/importCommonJSDestruct/index.js";
import importCommonJSAs from "../ast/importCommonJSAs/index.js";
import importESM from "../ast/importESM/index.js";
import importESMAs from "../ast/importESMAs/index.js";

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
function isAlreadyThereESM(ast, what, where) {
  return ast.body.some(
    (n) =>
      n?.type === "ImportDeclaration" &&
      (n.specifiers || []).some((s) => s?.local?.value === what) &&
      n?.source?.value === where
  );
}
function isAlreadyThereCommonJS(ast, what, where) {
  return ast.body.some(
    (n) =>
      n?.type === "VariableDeclaration" &&
      n.declarations.some(
        (d) =>
          (
            (d?.id?.properties || []).some((p) => p?.key?.value === what) ||
            (d?.id?.value === what)
          ) &&
          d?.init?.type === "CallExpression" &&
          d?.init?.callee?.value === "require" &&
          (d?.init?.arguments || []).some((a) => a?.expression?.value === where)
      )
  );
}

export default function insertImports(ast, what, where, defaultExport = true, asSomething = null) {
  if (defineModuleSystem(ast) === "commonjs") {
    if (defaultExport) {
      if (!isAlreadyThereCommonJS(ast, what, where)) {
        insert(ast, importCommonJS(asSomething !== null ? asSomething : what, where));
      }
    } else {
      if (!isAlreadyThereCommonJS(ast, what, where)) {
        if (asSomething) {
          insert(ast, importCommonJSAs(what, where, asSomething));
        } else {
          insert(ast, importCommonJSDestruct(what, where));
        }
      }
    }
  } else {
    if (!isAlreadyThereESM(ast, what, where)) {
      if (asSomething && !defaultExport) {
        insert(ast, importESMAs(what, where, asSomething));
      } else {
        insert(
          ast,
          importESM(
            defaultExport ? (asSomething !== null ? asSomething : what) : what,
            where,
            defaultExport ? "ImportDefaultSpecifier" : "ImportSpecifier"
          )
        );
      }
    }
  }
};
