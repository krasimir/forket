import insertImports from "./insertImports.js";
import traverseNode from "./traverseNode.js";
import getClientBoundaryWrapper from "../ast/clientBoundaryWrapper/index.js";
import getId from "./getId.js";

export default async function createClientBoundary(node, imp, filePath) {
  const componentsToClientBoundaries = [];

  // Finding out the exact name of the component/s
  node.ast.body = node.ast.body
    .map((n, index) => {
      if (n.type === "ImportDeclaration") {
        if (n?.source?.value === imp.source) {
          for (let i = 0; i < (n?.specifiers || []).length; i++) {
            let specifier = n.specifiers[i];
            if (specifier.type === "ImportDefaultSpecifier" && specifier.local.value) {
              componentsToClientBoundaries.push(specifier.local.value);
            }
          }
        }
      }
      return n;
    })
    .filter(Boolean);

  // Replacing the default export with the client boundary component
  traverseNode(node.ast, {
    JSXOpeningElement(n) {
      if (n?.name?.value && componentsToClientBoundaries.includes(n.name.value)) {
        n.name.value = `${n.name.value}Boundary`;
      }
    },
    JSXClosingElement(n) {
      if (n?.name?.value && componentsToClientBoundaries.includes(n.name.value)) {
        n.name.value = `${n.name.value}Boundary`;
      }
    }
  });

  // Creating the client boundary component
  if (componentsToClientBoundaries.length > 0) {
    componentsToClientBoundaries.forEach((compName) => {
      node.ast.body.push(getClientBoundaryWrapper(getId(), compName));
    });
    insertImports(node.ast, "forketSerializeProps", "forket/lib/utils/serializeProps.js");
  }

  return componentsToClientBoundaries;
}
