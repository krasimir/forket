const fs = require('fs');
const path = require('path');
const swc = require("@swc/core");
const get = require("lodash/get");
const { CachedInputFileSystem, ResolverFactory } = require("enhanced-resolve");
const { clearPath } = require("./utils/fsHelprs.js");

const traverseNode = require("./utils/traverseNode.js");

const VALID_ENTRY_POINTS = [".js", ".jsx", ".ts", ".tsx"];
const DEBUGGING_MODULE_RESOLVING = false;

async function processFile(file) {
  const code = fs.readFileSync(file, 'utf8');
  const { parse } = swc;
  const ast = await parse(code, {
    syntax: "typescript", // or 'ecmascript'
    tsx: true,
    decorators: false
  });

  const { imports } = processAST(ast);

  function processAST(ast, type) {
    const imports = [];

    function processImports(node) {
      imports.push({ source: get(node, "source.value") });
    }
    function processCallExpression(node) {
      if (get(node, 'callee.value') === "require") {
        imports.push({ source: get(node, "arguments[0].expression.value") });
      }
    }

    traverseNode(ast, {
      ImportDeclaration: processImports,
      CallExpression: processCallExpression
    });

    return {
      imports
    };
  }

  return {
    file,
    code,
    ast,
    imports,
    children: []
  };
}
async function resolveImports(host, request) {
  const fileSystem = new CachedInputFileSystem(fs, 4000);
  const resolver = ResolverFactory.createResolver({
    conditionNames: ["import", "require", "default"],
    useSyncFileSystemCalls: false,
    fileSystem,
    extensions: VALID_ENTRY_POINTS
  });

  return new Promise((resolve, reject) => {
    resolver.resolve({}, path.dirname(host), request, {}, (err, result) => {
      if (err) {
        return reject(err);
      }
      if (!result) {
        return reject(new Error(`Module "${request}" is not found in "${host}"`));
      }
      if (result.match(/node_modules/)) {
        return reject(new Error(`Module is somewhere in node_modules`));
      }
      resolve(result);
    });
  });
}
async function processEntryPoint(entryPoint) {
  const PROCESSED = new Map();
  const RESOLVED = new Map();

  async function process(filePath) {
    DEBUGGING_MODULE_RESOLVING && console.log("Processing:", filePath);
    let node = PROCESSED.get(filePath);
    if (!node) {
      node = await processFile(filePath);
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
          resolved = await resolveImports(filePath, imp.source);
          RESOLVED.set(key, resolved);
        }
        if (resolved !== null) {
          node.children.push(await process(resolved));
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
  async buildGraphs(dir) {
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
  printGraph(node, indent = "") {
    console.log(`${indent}${clearPath(node.file)}`);
    if (node.children.length > 0) {
      node.children.forEach((child) => {
        api.printGraph(child, indent + "   ");
      });
    }
  }
};

module.exports = api;