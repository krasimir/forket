import swc from "@swc/core";
import chalk from "chalk";
import path from 'path';

import { getNode } from "./graph.js";
import { ROLE } from "./constants.js";
import traverseNode from "./utils/traverseNode.js";
import getClientBoundaryWrapper from './ast/clientBoundaryWrapper/index.js';
import insertImports from "./utils/insertImports.js";
import processServerAction from "./utils/processServerActions.js";
import { encrypt } from "./utils/encryption.js";

export const MODE = {
  CLIENT: "client",
  SERVER: "server"
};

export function Thanos() {
  let id = 0;
  const clientBoundaries = [];
  const clientEntryPoints = [];
  let serverActions = [];

  async function snap(graphs, filePath, content, mode, options) {
    if (mode === MODE.SERVER) {
      for (let i = 0; i < graphs.length; i++) {
        const graph = graphs[i];
        const node = getNode(graph, filePath);
        if (node?.role === ROLE.SERVER) {
          for (let j = 0; j < (node?.imports || []).length; j++) {
            if (node.imports[j].resolvedTo) {
              const importedNode = getNode(graph, node.imports[j].resolvedTo);
              if (importedNode && importedNode?.role === ROLE.CLIENT && node?.role !== ROLE.CLIENT) {
                console.log(chalk.gray("  - Client boundary found: " + node.imports[j].source));
                const compNames = await createClientBoundary(node, node.imports[j], filePath);
                clientBoundaries.push({ compNames, importedNode });
                const transformed = await swc.print(node.ast, {
                  minify: false
                });
                return transformed.code;
              }
            }
          }
        }
      }
      return content;
    } else {
      for (let i = 0; i < graphs.length; i++) {
        const graph = graphs[i];
        const node = getNode(graph, filePath);
        if (node) {
          if (node.role === ROLE.CLIENT) {
            if (!node.parentNode) {
              console.log(chalk.gray("  - Client entry point found: " + node.file));
              clientEntryPoints.push(node);
            }
            return content;
          }
        }
      }
      if (options.clientCopyableFiles.indexOf(path.extname(filePath).toLowerCase()) >= 0) {
        // console.log(chalk.gray("  - Copyable client file: " + filePath));
        return content;
      }
      return false;
    }
  }
  async function createClientBoundary(node, imp, filePath) {
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

    // Handling server actions
    serverActions.push(...processServerAction(node.ast, filePath, encrypt, getId));

    return componentsToClientBoundaries;
  }
  function getId() {
    return "f_" + id++;
  }

  return {
    snap,
    clientBoundaries,
    clientEntryPoints,
    serverActions
  };
}
