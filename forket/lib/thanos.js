const get = require("lodash/get");
const swc = require("@swc/core");

const { getNode, resolveImport } = require("./graph");
const { ROLE } = require("./constants.js");
const traverseNode = require("./utils/traverseNode.js");

const MODE = {
  CLIENT: "client",
  SERVER: "server"
};

async function snap(graphs, filePath, content, mode) {
  if (mode === MODE.CLIENT) {
    for (let i = 0; i < graphs.length; i++) {
      const graph = graphs[i];
      const node = getNode(graph, filePath);
      if (node) {
        if (node.role === ROLE.CLIENT_COMPONENT || node.role === ROLE.CLIENT_FILE) {
          return content;
        } else {
          return await transformForClientUsage(graph, node);
        }
      }
    }
    return false;
  } else {
    return content;
  }
}

async function transformForClientUsage(graph, node) {
  console.log("------->", node.file);

  /* **** Keeping the imports that are targetting files into the graph **** */
  let importsToKeep = [];
  for (let i = 0; i < node.imports.length; i++) {
    const imp = node.imports[i];
    try {
      const resolved = await resolveImport(node.file, imp.source);
      const importedNode = getNode(graph, resolved);
      if (importedNode) {
        importsToKeep.push(imp);
      }
    } catch (err) {
      // console.log(`ignoring ${imp.source}`);
    }
  }
  importsToKeep = importsToKeep.map((imp) => imp.source);
  node.ast.body = node.ast.body.map((n) => {
    if (n.type === "ImportDeclaration" && importsToKeep.includes(get(n, "source.value"))) {
      return n;
    } else if (n.type === "ExportDefaultDeclaration") {

    } else if (
      (n.type === "ExportDefaultDeclaration" ||
        n.type === "ExportDeclaration" ||
        n.type === "ExportNamedDeclaration") &&
      containsExportsThatHasJSX(n)
    ) {
      return n;
    }
    return false;
  }).filter(Boolean);

  /* **** Generating the transformed code **** */
  const transformed = await swc.print(node.ast, {
    minify: false
  });
  return transformed.code;
}

module.exports = {
  MODE,
  snap,
  transformForClientUsage
};

/* **** Utilities **** */
function containsExportsThatHasJSX(node) {
  let result = false;
  function processReturn(n) {
    if (result) return;
    if(containsJSXReturn(n)) {
      result = true;
    }
  }
  function processArrowFunctionExpression(n) {
    if (result) return;
    if (n.body && n.body.type === "JSXElement") {
      result = true;
    }
  }
  traverseNode(node, {
    ReturnStatement: processReturn,
    ArrowFunctionExpression: processArrowFunctionExpression,
  });
  return result;
}
function containsJSXReturn(node) {
  let found = false;

  function deepCheck(n) {
    if (!n || found) return;

    if (n.type === "JSXElement") {
      found = true;
      return;
    }

    for (const key in n) {
      const child = n[key];

      if (Array.isArray(child)) {
        for (const c of child) {
          if (c && typeof c.type === "string") deepCheck(c);
        }
      } else if (child && typeof child.type === "string") {
        deepCheck(child);
      }
    }
  }

  deepCheck(node); // pass the block body
  return found;
}