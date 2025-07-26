const swc = require("@swc/core");

const { getNode, resolveImport, printGraph } = require("./graph");
const { ROLE } = require("./constants.js");
const traverseNode = require("./utils/traverseNode.js");
const getClientBoundaryWrapper = require('./ast/clientBoundaryWrapper');
const getPropsSerializer = require('./ast/propsSerializer');

const MODE = {
  CLIENT: "client",
  SERVER: "server"
};

function Thanos() {
  let id = 0;

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
                return await createClientBoundary(graph, node, node.imports[j], importedNode);
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
            return content;
          }
        }
      }
      return false;
    }
  }
  async function createClientBoundary(graph, node, imp, importedNode) {
    console.log("𐂐 Client boundary: ", imp.source);

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
        insertAfterImports(node.ast, getClientBoundaryWrapper(getId(), compName));
      });
      insertAfterImports(node.ast, getPropsSerializer());
    }

    // Generating the new code
    const transformed = await swc.print(node.ast, {
      minify: false
    });
    return transformed.code;
  }
  function getId() {
    return "f_" + id++;
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
function insertAfterImports(ast, node) {
  if (!ast.body) {
    return;
  }
  let detectedImports = false;
  for(let i = 0; i < ast.body.length; i++) {
    const n = ast.body[i];
    if (
      n.type === "ImportDeclaration" ||
      (n.type === "VariableDeclaration" && n?.init?.type === "CallExpression" && n?.init?.callee?.value === "require")
    ) {
      detectedImports = true;
    }
    if (detectedImports && n.type !== "ImportDeclaration") {
      ast.body.splice(i, 0, node);
      return;
    }
  }
  if (!detectedImports) {
    ast.body.unshift(node);
  } else {
    ast.body.push(node);
  }
}
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