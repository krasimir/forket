const swc = require("@swc/core");

const { getNode, resolveImport, printGraph } = require("./graph");
const { ROLE } = require("./constants.js");
const traverseNode = require("./utils/traverseNode.js");

const MODE = {
  CLIENT: "client",
  SERVER: "server"
};

function Thanos() {
  let id = 0;

  async function snap(graphs, filePath, content, mode) {
    console.log("--> Thanos.snap", filePath, mode);
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
      for (let i = 0; i < graphs.length; i++) {
        const graph = graphs[i];
        const node = getNode(graph, filePath);
        if (node) {
          console.log(i, node.file, node.role);
        }
      }
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
        // console.log(`ignoring ${imp.source} error: ${err.message}`);
      }
    }
    importsToKeep = importsToKeep.map((imp) => imp.source);

    /* **** Transforming the AST **** */

    const nodesToPrepend = [];
    let containsJSX = false;
    let directive = null;

    node.ast.body = node.ast.body
      .map((n, index) => {
        if (n.type === "ExpressionStatement" && n?.expression?.type === "StringLiteral") {
          directive = n;
        } else if (n.type === "ImportDeclaration" && importsToKeep.includes(n?.source?.value)) {
          return n;
        } else if (n.type === "ExportDefaultDeclaration" && containsExportsThatHasJSX(n)) {
          if (n?.decl?.type === "FunctionExpression") {
            n.decl = getFunctionExpressionTemplate(n?.decl?.identifier?.value, getId());
            containsJSX = true;
            return n;
          }
          return false;
        } else if (n.type === "ExportDefaultExpression" && n?.expression?.type === "Identifier") {
          let keepit = false;
          function FunctionDeclaration(_n) {
            if (_n?.identifier?.value === n?.expression?.value && containsExportsThatHasJSX(_n)) {
              keepit = true;
              containsJSX = true;
              nodesToPrepend.push({ index, node: getFunctionDeclarationTemplate(_n?.identifier?.value, getId()) });
            }
          }
          function VariableDeclarator(_n) {
            if (
              _n?.id?.type === "Identifier" &&
              _n?.id?.value === n?.expression?.value &&
              (_n?.init?.type === "FunctionExpression" || _n?.init?.type === "ArrowFunctionExpression") &&
              containsExportsThatHasJSX(_n?.init)
            ) {
              keepit = true;
              containsJSX = true;
              nodesToPrepend.push({ index, node: getFunctionDeclarationTemplate(_n?.id?.value, getId()) });
            }
          }
          traverseNode(node.ast, {
            FunctionDeclaration,
            VariableDeclarator
          });
          if (keepit) {
            return n;
          }
        } else if (n.type === "ExportDeclaration" && containsExportsThatHasJSX(n)) {
          if (n?.declaration?.type === "FunctionDeclaration") {
            containsJSX = true;
            n.declaration = getFunctionDeclarationTemplate(n?.declaration?.identifier?.value, getId());
            return n;
          } else if (n?.declaration?.type === "VariableDeclaration") {
            let transformed = false;
            function replacer(n) {
              containsJSX = true;
              n.body = getReturnTemplateStatement(getId());
              transformed = true;
            }
            traverseNode(n.declaration, {
              FunctionExpression: replacer,
              ArrowFunctionExpression: replacer
            });
            if (transformed) {
              return n;
            }
          }
          return false;
        }
        return false;
      })
      .filter(Boolean);
    
    nodesToPrepend.forEach(({ index, node: n }) => {
      node.ast.body.splice(index - 1, 0, n);
    });
    if (containsJSX) {
      node.ast.body = [getReactInTheScope(), ...node.ast.body];
    }
    if (directive) {
      node.ast.body = [directive, ...node.ast.body];
    }

    /* **** Generating the transformed code **** */
    const transformed = await swc.print(node.ast, {
      minify: false
    });
    return transformed.code;
  }
  function getId() {
    return "T:" + id++;
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
function getFunctionExpressionTemplate(funcName, id) {
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
    body: getReturnTemplateStatement(id),
    generator: false,
    async: false,
    typeParameters: null,
    returnType: null
  };
}
function getFunctionDeclarationTemplate(funcName, id) {
  return {
    type: "FunctionDeclaration",
    identifier: {
      type: "Identifier",
      span: {
        start: 17,
        end: 20
      },
      ctxt: 2,
      value: funcName,
      optional: false
    },
    declare: false,
    params: [],
    decorators: [],
    span: {
      start: 8,
      end: 136
    },
    ctxt: 3,
    body: getReturnTemplateStatement(id),
    generator: false,
    async: false,
    typeParameters: null,
    returnType: null
  };
}
function getReturnTemplateStatement(id) {
  return {
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
              value: "span",
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
              value: "span",
              optional: false
            }
          }
        }
      }
    ]
  };
}
function getReactInTheScope() {
  return {
    type: "ImportDeclaration",
    span: {
      start: 1,
      end: 27
    },
    specifiers: [
      {
        type: "ImportDefaultSpecifier",
        span: {
          start: 8,
          end: 13
        },
        local: {
          type: "Identifier",
          span: {
            start: 8,
            end: 13
          },
          ctxt: 2,
          value: "React",
          optional: false
        }
      }
    ],
    source: {
      type: "StringLiteral",
      span: {
        start: 19,
        end: 26
      },
      value: "react",
      raw: '"react"'
    },
    typeOnly: false,
    with: null,
    phase: "evaluation"
  };
}