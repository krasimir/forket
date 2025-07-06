const fs = require('fs');
const path = require('path');
const swc = require("@swc/core");
const get = require("lodash/get");
const { CachedInputFileSystem, ResolverFactory, Resolver } = require("enhanced-resolve");

const { clearPath } = require("./utils/fsHelpers.js");
const traverseNode = require("./utils/traverseNode.js");
const { VALID_ENTRY_POINTS, ROLE } = require("./constants.js");
const { ResolverError, ResolverModuleNotFoundError, ResolverIsInNodeModulesError } = require("./utils/errors.js");

const DEBUGGING_MODULE_RESOLVING = false;
let SEARCH_CACHE = new Map();
let RESOLVED_CACHE = new Map();

const fileSystem = new CachedInputFileSystem(fs, 4000);
const resolver = ResolverFactory.createResolver({
  conditionNames: ["import", "require", "default"],
  useSyncFileSystemCalls: false,
  fileSystem,
  extensions: VALID_ENTRY_POINTS
});

async function processFile(file, parentNode = null) {
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
    let useClient = false;
    let clientFile = false;

    function processImports(node) {
      imports.push({ source: get(node, "source.value") });
      if (get(node, "source.value") === "react-dom/client") {
        clientFile = true;
      }
    }
    function processCallExpression(node) {
      if (get(node, 'callee.value') === "require") {
        imports.push({ source: get(node, "arguments[0].expression.value") });
      }
    }
    function processExpressionStatement(node) {
      if (get(node, "expression.type") === "StringLiteral" && get(node, "expression.value") === "use client") {
        useClient = true;
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
      clientFile
    };
  }

  return Object.assign(
    {
      file,
      code,
      ast,
      children: [],
      role: ROLE.SERVER,
      parentNode
    },
    astProps
  );
}
async function resolveImport(host, request) {
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

async function processEntryPoint(entryPoint) {
  const PROCESSED = new Map();
  const RESOLVED = new Map();
  async function process(filePath, parentNode = null) {
    DEBUGGING_MODULE_RESOLVING && console.log("Processing:", filePath);
    let node = PROCESSED.get(filePath);
    if (!node) {
      node = await processFile(filePath, parentNode);
      PROCESSED.set(filePath, node);
    } else {
      DEBUGGING_MODULE_RESOLVING && console.log(`File "${filePath}" is already processed, skipping.`);
      return;
    }
    DEBUGGING_MODULE_RESOLVING && console.log(node.imports);
    for (let j = 0; j < node.imports.length; j++) {
      const imp = node.imports[j];
      if (!imp.source) {
        continue;
      }
      const key = `${path.dirname(filePath)}:${imp.source}`;
      try {
        let resolved = RESOLVED.get(key);
        if (typeof resolved === "undefined") {
          resolved = await resolveImport(filePath, imp.source);
          RESOLVED.set(key, resolved);
        }
        if (resolved !== null) {
          node.children.push(await process(resolved, node));
        } else {
          DEBUGGING_MODULE_RESOLVING && console.log(`Ignoring ${imp.source}`);
        }
      } catch (err) {
        DEBUGGING_MODULE_RESOLVING && console.log(`Ignoring ${imp.source}`);
        RESOLVED.set(key, null);
      }
    }
    return node;
  }
  return process(entryPoint);
}

const api = {
  processFile,
  processEntryPoint,
  async buildGraphs(dir) {
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
      graphs.push(await processEntryPoint(entryPoint));
    }
    return graphs;
  },
  getNode(node, filePath) {
    if (SEARCH_CACHE.has(filePath)) {
      return SEARCH_CACHE.get(filePath);
    }
    if (node.file === filePath) {
      SEARCH_CACHE.set(filePath, node);
      return node;
    }
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const found = api.getNode(child, filePath);
      if (found) {
        return found;
      }
    }
    return null;
  },
  resolveImport,
  printGraph(node, indent = "") {
    console.log(`${indent}${clearPath(node.file)} (${node.role})`);
    if (node.children.length > 0) {
      node.children.forEach((child) => {
        api.printGraph(child, indent + "   ");
      });
    }
  },
  toJSON(node) {
    return {
      [clearPath(node.file)]: {
        role: node.role,
        children: node.children.map((child) => {
          return api.toJSON(child);
        })
      }
    }
  }
};

module.exports = api;