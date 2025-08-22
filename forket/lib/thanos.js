import swc from "@swc/core";
import chalk from "chalk";
import path from 'path';

import { getNode, getNodesContainingServerActions } from "./graph.js";
import { ROLE } from "./constants.js";
import { dealWithSAImportedInClientNode, processServerActions } from "./utils/processServerActions.js";
import faceliftTheServerActionsSetup from "./utils/faceliftTheServerActionsSetup.js";
import createClientBoundary from "./utils/createClientBoundary.js";

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
          // checking for client boundaries
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
          await faceliftTheServerActionsSetup(node, options, serverEntryPoints);
          const transformed = await swc.print(node.ast, {
            minify: false
          });
          return transformed.code;
        } else {
          if (node?.serverActions && node?.serverActions.length > 0 && node?.role === ROLE.CLIENT) {
            throw new Error(
              `‎file ${node.file} contains server actions but looks like is marked as client component. Add "use server" at the top.`
            );
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
            // finding out the client entry point
            if (!node.parentNode) {
              console.log(chalk.gray("  - Client entry point found: " + node.file));
              clientEntryPoints.push(node);
            }
            // checking if the client component is importing server actions
            for (let j = 0; j < (node?.imports || []).length; j++) {
              if (node.imports[j].resolvedTo) {
                const importedNode = getNode(graph, node.imports[j].resolvedTo);
                if (importedNode.role === ROLE.SERVER) {
                  serverActions.push(...dealWithSAImportedInClientNode(node, node.imports[j]));
                }
              }
            }
            const transformed = await swc.print(node.ast, {
              minify: false
            });
            return transformed.code;
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
  
  return {
    snap,
    clientBoundaries,
    clientEntryPoints,
    serverEntryPoints,
    serverActions
  };
}
