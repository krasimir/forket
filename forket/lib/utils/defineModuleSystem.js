import traverseNode  from "./traverseNode.js";

export default function defineModuleSystem(ast) {
  let usesESM = false;
  let usesCommonJS = false;

  traverseNode(ast, {
    ImportDeclaration() {
      usesESM = true;
    },
    ExportNamedDeclaration() {
      usesESM = true;
    },
    ExportDefaultDeclaration() {
      usesESM = true;
    },
    CallExpression(node) {
      if (node?.callee?.value === "require") {
        usesCommonJS = true;
      }
    },
    AssignmentExpression(path) {
      const left = path.node.left;
      if (left.type === "MemberExpression" && left.object.type === "Identifier") {
        if (left.object.name === "module" && left.property.name === "exports") {
          usesCommonJS = true;
        }
        if (left.object.name === "exports") {
          usesCommonJS = true;
        }
      }
    }
  });

  if (usesESM && !usesCommonJS) return "esm";
  if (usesCommonJS && !usesESM) return "commonjs";
  return "mixed";
};
