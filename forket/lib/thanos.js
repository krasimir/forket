import swc from "@swc/core";
import chalk from "chalk";
import path from 'path';

import getId from './utils/getId.js'
import { getNode, getNodesContainingServerActions } from "./graph.js";
import { ROLE } from "./constants.js";
import traverseNode from "./utils/traverseNode.js";
import getClientBoundaryWrapper from './ast/clientBoundaryWrapper/index.js';
import insertImports from "./utils/insertImports.js";
import processServerActions from "./utils/processServerActions.js";
import getImportPath from "./utils/getImportPath.js";

export const MODE = {
  CLIENT: "client",
  SERVER: "server"
};

export function Thanos() {
  const clientBoundaries = [];
  const clientEntryPoints = [];
  const serverEntryPoints = [];
  const serverActions = [];

  async function snap(graphs, filePath, content, mode, options) {
    if (mode === MODE.SERVER) {
      for (let i = 0; i < graphs.length; i++) {
        const graph = graphs[i];
        const serverActionsContainingNodes = getNodesContainingServerActions(graph);
        const node = getNode(graph, filePath);
        if (node?.role === ROLE.SERVER) {
          serverActions.push(...processServerActions(node, serverActionsContainingNodes, serverActions));
          for (let j = 0; j < (node?.imports || []).length; j++) {
            if (node.imports[j].resolvedTo) {
              const importedNode = getNode(graph, node.imports[j].resolvedTo);
              if (importedNode && importedNode?.role === ROLE.CLIENT && node?.role !== ROLE.CLIENT) {
                console.log(chalk.gray("  - Client boundary found for " + node.imports[j].source));
                const compNames = await createClientBoundary(node, node.imports[j], filePath);
                clientBoundaries.push({ compNames, importedNode });
              }
            }
          }
          await faceliftTheServerActionsSetup(node, options);
          const transformed = await swc.print(node.ast, {
            minify: false
          });
          return transformed.code;
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

    return componentsToClientBoundaries;
  }
  function faceliftTheServerActionsSetup(node, options) {
    /* Amending the forket.setupForketSA(app) call so it looks like
    forket.setupForketSA(app, forketServerActionsHandler);
    */
    return new Promise((done) => {
      let found = false;
      traverseNode(node.ast, {
        MemberExpression(n, stack) {
          if (n?.property?.value === "setupForketSA") {
            serverEntryPoints.push(node);
            if (stack[0].arguments && Array.isArray(stack[0].arguments)) {
              stack[0].arguments.push({
                spread: null,
                expression: {
                  type: "Identifier",
                  span: {
                    start: 722,
                    end: 725
                  },
                  ctxt: 2,
                  value: "forketServerActionsHandler",
                  optional: false
                }
              });
              const handlerPath = getImportPath(
                  node.file,
                  path.join(options.sourceDir, options.forketServerActionsHandler)
              ) + ".js";
              insertImports(node.ast, "forketServerActionsHandler", handlerPath);
            }
            found = true;
            done(true);
          }
        }
      });
      if (!found) {
        done(false);
      }
    });
  }

  return {
    snap,
    clientBoundaries,
    clientEntryPoints,
    serverEntryPoints,
    serverActions
  };
}
