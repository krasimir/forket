const swc = require("@swc/core");
const chalk = require("chalk");

const { getNode, resolveImport, printGraph } = require("./graph");
const { ROLE } = require("./constants.js");
const traverseNode = require("./utils/traverseNode.js");
const getClientBoundaryWrapper = require('./ast/clientBoundaryWrapper');
const getPropsSerializer = require('./ast/propsSerializer');
const insertImports = require("./utils/insertImports");

const MODE = {
  CLIENT: "client",
  SERVER: "server"
};

function Thanos() {
  let id = 0;
  const clientBoundaries = [];
  const clientEntryPoints = [];

  async function snap(graphs, filePath, content, mode) {
    if (mode === MODE.SERVER) {
      for (let i = 0; i < graphs.length; i++) {
        const graph = graphs[i];
        const node = getNode(graph, filePath);
        if (node?.role === ROLE.SERVER) {
          for (let j = 0; j < (node?.imports || []).length; j++) {
            if (node.imports[j].resolvedTo) {
              const importedNode = getNode(graph, node.imports[j].resolvedTo);
              if (importedNode && importedNode?.role === ROLE.CLIENT && node?.role !== ROLE.CLIENT) {
                console.log(chalk.gray("  - Client boundary: " + node.imports[j].source));
                clientBoundaries.push(importedNode);
                await createClientBoundary(graph, node, node.imports[j], importedNode);
                // Generating the new code
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
              console.log(chalk.gray("  - Client entry point: " + node.file));
              clientEntryPoints.push(node);
            }
            return content;
          }
        }
      }
      return false;
    }
  }
  async function createClientBoundary(graph, node, imp, importedNode) {
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
        insertImports(node.ast, getClientBoundaryWrapper(getId(), compName));
      });
      insertImports(node.ast, getPropsSerializer());
    }
  }
  function getId() {
    return "f_" + id++;
  }

  return {
    snap,
    clientBoundaries,
    clientEntryPoints
  };
}

module.exports = {
  MODE,
  Thanos
};
