const get = require("lodash/get");
const swc = require("@swc/core");

const { getNode, resolveImport } = require("./graph");
const { ROLE } = require("./constants.js");

const MODE = {
  CLIENT: "thanos_client",
  SERVER: "thanos_server"
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
  importsToKeep = importsToKeep.map(imp => imp.source)
  node.ast.body = node.ast.body.filter((n) => {
    if (n.type === "ImportDeclaration" && importsToKeep.includes(get(n, "source.value"))) {
      return true;
    }
    return false;
  });
  const transformed = await swc.print(node.ast, {
    minify: false,
  });
  return transformed.code;
}

module.exports = {
  MODE,
  snap
};
