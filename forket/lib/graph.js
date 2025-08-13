import fs from 'fs';
import path from 'path';
import swc from '@swc/core';
import get from 'lodash/get.js';
import enhancedResolve from 'enhanced-resolve';
import chalk from "chalk";

import { clearPath } from "./utils/fsHelpers.js";
import traverseNode from "./utils/traverseNode.js";
import { VALID_ENTRY_POINTS, ROLE } from "./constants.js";
import { ResolverError, ResolverModuleNotFoundError, ResolverIsInNodeModulesError } from "./utils/errors.js";
import getId from './utils/getId.js';

const { CachedInputFileSystem, ResolverFactory } = enhancedResolve;

let SEARCH_CACHE = new Map();
let RESOLVED_CACHE = new Map();

const fileSystem = new CachedInputFileSystem(fs, 4000);
const resolver = ResolverFactory.createResolver({
  conditionNames: ["import", "require", "default"],
  useSyncFileSystemCalls: false,
  fileSystem,
  extensions: VALID_ENTRY_POINTS
});

export async function createNode(file, parentNode = null) {
  const code = fs.readFileSync(file, 'utf8');
  const { parse } = swc;
  const ast = await parse(code, {
    syntax: "typescript", // or 'ecmascript'
    tsx: true,
    decorators: false
  });

  const astProps = processAST(ast);

  function processAST(ast, type) {
    const imports = [];
    const serverActions = [];
    let useClient = false;

    function processImports(node) {
      if ((node?.source?.value || '').match(/\/\.\.\/\.\.\/forket/)) {
        // Ignoring the Forket source import that we use while developing with the playground
        return;
      }
      imports.push({
        what: (node?.specifiers || []).map((s) => {
          return s?.local?.value;
        }).filter(Boolean),
        source: get(node, "source.value")
      });
    }
    function processCallExpression(node, stack) {
      if (node?.callee.value === "require") {
        let what;
        if (stack[0]?.type === 'VariableDeclarator') {
          if (stack[0]?.id?.type === 'ObjectPattern') {
            what = (stack[0]?.id?.properties || [])
              .map((prop) => prop?.key?.value)
              .filter(Boolean);
          } else {
            what = [stack[0]?.id?.value];
          }
        }
        imports.push({
          what: (what || []).filter(Boolean),
          source: get(node, "arguments[0].expression.value")
        });
      }
    }
    function processExpressionStatement(node, stack) {
      if (node?.expression.type === "StringLiteral" && node?.expression?.value === "use client") {
        useClient = true;
      } else if (node?.expression?.type === "StringLiteral" && node?.expression?.value == "use server") {
        const funcNode = stack[1];
        if (funcNode && funcNode?.type === "FunctionDeclaration") {
          const funcName = funcNode?.identifier?.value;
          if (!funcName) {
            return;
          }
          serverActions.push({ funcName, funcNode, stack });
        } else if (funcNode && funcNode?.type === "ArrowFunctionExpression") {
          const funcName = stack[2]?.id?.value;
          if (!funcName) {
            return;
          }
          serverActions.push({ funcName, funcNode, stack });
        }
      }
    }

    traverseNode(ast, {
      ImportDeclaration: processImports,
      CallExpression: processCallExpression,
      ExpressionStatement: processExpressionStatement
    });

    return {
      imports,
      useClient,
      serverActions
    };
  }

  return {
    id: getId(),
    file,
    code,
    ast,
    children: [],
    role: ROLE.SERVER,
    parentNode,
    imports: astProps.imports,
    useClient: astProps.useClient,
    serverActions: astProps.serverActions
  };
}
export function getNode(node, filePath) {
  if (SEARCH_CACHE.has(node.id + filePath)) {
    return SEARCH_CACHE.get(node.id + filePath);
  }
  if (node.file === filePath) {
    SEARCH_CACHE.set(node.id + filePath, node);
    return node;
  }
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    const found = getNode(child, filePath);
    if (found) {
      SEARCH_CACHE.set(node.id + filePath, found);
      return found;
    }
  }
  return null;
}
export async function getGraph(entryPoint) {
  const PROCESSED = new Map();
  const RESOLVED = new Map();
  async function process(filePath, parentNode = null) {
    // console.log("Processing:", filePath);
    let node = PROCESSED.get(filePath);
    if (!node) {
      node = await createNode(filePath, parentNode);
      PROCESSED.set(filePath, node);
    } else {
      // console.log(`File "${filePath}" is already processed, skipping.`);
      return;
    }
    for (let j = 0; j < node.imports.length; j++) {
      const imp = node.imports[j];
      if (!imp.source) {
        continue;
      }
      const key = `${path.dirname(filePath)}:${imp.source}`;
      try {
        let resolved = RESOLVED.get(key);
        if (typeof resolved === "undefined") {
          resolved = await resolveImport(filePath, imp.source.replace(/\.(js|ts|tsx|jsx)$/, ""));
          RESOLVED.set(key, resolved);
        }
        if (resolved !== null) {
          imp.resolvedTo = resolved;
          node.children.push(await process(resolved, node));
        } else {
          // console.log(`Ignoring ${imp.source}`);
        }
      } catch (err) {
        // console.log(`Ignoring ${imp.source}`, err.message);
        RESOLVED.set(key, null);
      }
    }
    return node;
  }
  return process(entryPoint);
}
export async function getGraphs(dir) {
  SEARCH_CACHE = new Map();
  RESOLVED_CACHE = new Map();
  // finding the entry points for processing
  const entryPoints = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => {
      return entry.isFile() && VALID_ENTRY_POINTS.includes("." + (entry.name.split(".").pop() || ""));
    })
    .map((entry) => path.join(dir, entry.name));

  // resolving the imports and building the graph
  const graphs = [];
  for (let i = 0; i < entryPoints.length; i++) {
    const entryPoint = entryPoints[i];
    graphs.push(await getGraph(entryPoint));
  }
  return graphs;
}
export function printGraph(node, indent = "") {
  console.log(
    chalk.grey(`${indent}#${node.id}`) +
      chalk.magenta(` ${clearPath(node.file)}`) +
      chalk.grey(` (${node.role})`) +
      (node.serverActions.length > 0 ? chalk.grey(` (SAs: ${node.serverActions.map(({ funcName }) => funcName)})`) : "")
  );
  if (node.children.length > 0) {
    node.children.forEach((child) => {
      printGraph(child, indent + "   ");
    });
  }
}
export function toJSON(node) {
  return {
    [clearPath(node.file)]: {
      role: node.role,
      children: node.children.map((child) => {
        return toJSON(child);
      })
    }
  };
}
export async function resolveImport(host, request) {
  return new Promise((resolve, reject) => {
    if (RESOLVED_CACHE.has(`${host}:${request}`)) {
      return resolve(RESOLVED_CACHE.get(`${host}:${request}`));
    }
    resolver.resolve({}, path.dirname(host), request, {}, (err, result) => {
      if (err) {
        return reject(new ResolverError(err.message));
      }
      if (!result) {
        return reject(new ResolverModuleNotFoundError());
      }
      if (result.match(/node_modules/)) {
        return reject(new ResolverIsInNodeModulesError());
      }
      RESOLVED_CACHE.set(`${host}:${request}`, result);
      resolve(result);
    });
  });
}
export function flattenNodes(graph) {
  let result = [];
  (function flatten(node) {
    result.push(node);
    node.children.forEach(flatten);
  })(graph);
  return result;
}
export function getNodesContainingServerActions(graph) {
  return flattenNodes(graph).filter((node) => node.serverActions.length > 0);
}