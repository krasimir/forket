const get = require("lodash/get");
const swc = require("@swc/core");

const { getNode, resolveImport } = require("./graph");
const { ROLE } = require("./constants.js");
const traverseNode = require("./utils/traverseNode.js");

const MODE = {
  CLIENT: "client",
  SERVER: "server"
};

function Thanos() {
  let id = 0;

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

    /* **** Transforming the AST **** */
    importsToKeep = importsToKeep.map((imp) => imp.source);
    node.ast.body = node.ast.body
      .map((n) => {
        if (n.type === "ImportDeclaration" && importsToKeep.includes(get(n, "source.value"))) {
          return n;
        } else if (n.type === "ExportDefaultDeclaration" && containsExportsThatHasJSX(n)) {
          if (get(n, "decl.type") === "FunctionExpression") {
            n.decl = getTemplateMock(get(n, "decl.identifier.value"), "T:" + (id++));
          }
          return n;
        } else if (
          (n.type === "ExportDefaultDeclaration" ||
            n.type === "ExportDeclaration" ||
            n.type === "ExportNamedDeclaration") &&
          containsExportsThatHasJSX(n)
        ) {
          return n;
        }
        return false;
      })
      .filter(Boolean);

    /* **** Generating the transformed code **** */
    const transformed = await swc.print(node.ast, {
      minify: false
    });
    return transformed.code;
  }

  return {
    snap
  }
}

module.exports = {
  MODE,
  Thanos
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
function getTemplateMock(funcName, id) {
  return {
    type: "FunctionExpression",
    identifier: {
      type: "Identifier",
      span: {
        start: 100,
        end: 103
      },
      ctxt: 2,
      value: funcName,
      optional: false
    },
    params: [],
    decorators: [],
    span: {
      start: 91,
      end: 150
    },
    ctxt: 3,
    body: {
      type: "BlockStatement",
      span: {
        start: 106,
        end: 150
      },
      ctxt: 3,
      stmts: [
        {
          type: "ReturnStatement",
          span: {
            start: 110,
            end: 148
          },
          argument: {
            type: "JSXElement",
            span: {
              start: 117,
              end: 147
            },
            opening: {
              type: "JSXOpeningElement",
              name: {
                type: "Identifier",
                span: {
                  start: 118,
                  end: 126
                },
                ctxt: 1,
                value: "template",
                optional: false
              },
              span: {
                start: 117,
                end: 136
              },
              attributes: [
                {
                  type: "JSXAttribute",
                  span: {
                    start: 127,
                    end: 135
                  },
                  name: {
                    type: "Identifier",
                    span: {
                      start: 127,
                      end: 129
                    },
                    value: "id"
                  },
                  value: {
                    type: "StringLiteral",
                    span: {
                      start: 130,
                      end: 135
                    },
                    value: id,
                    raw: `"${id}"`
                  }
                }
              ],
              selfClosing: false,
              typeArguments: null
            },
            children: [],
            closing: {
              type: "JSXClosingElement",
              span: {
                start: 136,
                end: 147
              },
              name: {
                type: "Identifier",
                span: {
                  start: 138,
                  end: 146
                },
                ctxt: 1,
                value: "template",
                optional: false
              }
            }
          }
        }
      ]
    },
    generator: false,
    async: false,
    typeParameters: null,
    returnType: null
  };
}