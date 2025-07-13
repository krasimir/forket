const swc = require("@swc/core");

const { getNode, resolveImport, printGraph } = require("./graph");
const { ROLE } = require("./constants.js");
const traverseNode = require("./utils/traverseNode.js");
const CODE = new Map();

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
          return content;
        }
      }
      return false;
    } else {
      for (let i = 0; i < graphs.length; i++) {
        const graph = graphs[i];
        const node = getNode(graph, filePath);
        if (node) {
          if (node.role === ROLE.CLIENT) {
            return content;
          } else {
            // return await transformForClientUsage(graph, node);
          }
        }
      }
      return false;
    }
  }
  async function createClientBoundary(graph, node, imp, importedNode) {
    console.log("------->", node.file, imp.source, node?.parentNode?.role);

    const componentsToClientBoundaries = [];

    node.ast.body = node.ast.body
      .map((n, index) => {
        if (n.type === "ImportDeclaration") {
          if (n?.source?.value === imp.source) {
            for (let i=0; i < (n?.specifiers || []).length; i++) {
              let specifier = n.specifiers[i];
              if (specifier.type === "ImportDefaultSpecifier" && specifier.local.value) {
                componentsToClientBoundaries.push(specifier.local.value);
                return false;
              }
            }
          }
          return n;
        }
        return n;
      })
      .filter(Boolean);
    
    if (componentsToClientBoundaries.length > 0) {
      componentsToClientBoundaries.forEach(compName => {
        insertAfterImports(node.ast, getClientBoundaryReplacement(getId(),compName));
      })
      insertAfterImports(node.ast, getClientBoundaryComponent());
    }

    /* **** Generating the transformed code **** */
    const transformed = await swc.print(node.ast, {
      minify: false
    });
    return transformed.code;
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
function getClientBoundaryComponent() {
  return {
    type: "FunctionDeclaration",
    identifier: {
      type: "Identifier",
      span: {
        start: 10,
        end: 24
      },
      ctxt: 2,
      value: "ClientBoundary",
      optional: false
    },
    declare: false,
    params: [
      {
        type: "Parameter",
        span: {
          start: 25,
          end: 27
        },
        decorators: [],
        pat: {
          type: "Identifier",
          span: {
            start: 25,
            end: 27
          },
          ctxt: 3,
          value: "id",
          optional: false,
          typeAnnotation: null
        }
      },
      {
        type: "Parameter",
        span: {
          start: 29,
          end: 42
        },
        decorators: [],
        pat: {
          type: "Identifier",
          span: {
            start: 29,
            end: 42
          },
          ctxt: 3,
          value: "componentName",
          optional: false,
          typeAnnotation: null
        }
      }
    ],
    decorators: [],
    span: {
      start: 1,
      end: 458
    },
    ctxt: 3,
    body: {
      type: "BlockStatement",
      span: {
        start: 44,
        end: 458
      },
      ctxt: 3,
      stmts: [
        {
          type: "ReturnStatement",
          span: {
            start: 48,
            end: 456
          },
          argument: {
            type: "ArrowFunctionExpression",
            span: {
              start: 55,
              end: 455
            },
            ctxt: 0,
            params: [
              {
                type: "Identifier",
                span: {
                  start: 56,
                  end: 61
                },
                ctxt: 4,
                value: "props",
                optional: false,
                typeAnnotation: null
              }
            ],
            body: {
              type: "ParenthesisExpression",
              span: {
                start: 66,
                end: 455
              },
              expression: {
                type: "JSXFragment",
                span: {
                  start: 72,
                  end: 451
                },
                opening: {
                  type: "JSXOpeningFragment",
                  span: {
                    start: 72,
                    end: 74
                  }
                },
                children: [
                  {
                    type: "JSXText",
                    span: {
                      start: 74,
                      end: 81
                    },
                    value: "\n      ",
                    raw: "\n      "
                  },
                  {
                    type: "JSXElement",
                    span: {
                      start: 81,
                      end: 194
                    },
                    opening: {
                      type: "JSXOpeningElement",
                      name: {
                        type: "Identifier",
                        span: {
                          start: 82,
                          end: 90
                        },
                        ctxt: 1,
                        value: "template",
                        optional: false
                      },
                      span: {
                        start: 81,
                        end: 194
                      },
                      attributes: [
                        {
                          type: "JSXAttribute",
                          span: {
                            start: 91,
                            end: 112
                          },
                          name: {
                            type: "Identifier",
                            span: {
                              start: 91,
                              end: 112
                            },
                            value: "data-client-component"
                          },
                          value: null
                        },
                        {
                          type: "JSXAttribute",
                          span: {
                            start: 113,
                            end: 125
                          },
                          name: {
                            type: "Identifier",
                            span: {
                              start: 113,
                              end: 120
                            },
                            value: "data-id"
                          },
                          value: {
                            type: "JSXExpressionContainer",
                            span: {
                              start: 121,
                              end: 125
                            },
                            expression: {
                              type: "Identifier",
                              span: {
                                start: 122,
                                end: 124
                              },
                              ctxt: 3,
                              value: "id",
                              optional: false
                            }
                          }
                        },
                        {
                          type: "JSXAttribute",
                          span: {
                            start: 126,
                            end: 156
                          },
                          name: {
                            type: "Identifier",
                            span: {
                              start: 126,
                              end: 140
                            },
                            value: "data-component"
                          },
                          value: {
                            type: "JSXExpressionContainer",
                            span: {
                              start: 141,
                              end: 156
                            },
                            expression: {
                              type: "Identifier",
                              span: {
                                start: 142,
                                end: 155
                              },
                              ctxt: 3,
                              value: "componentName",
                              optional: false
                            }
                          }
                        },
                        {
                          type: "JSXAttribute",
                          span: {
                            start: 157,
                            end: 191
                          },
                          name: {
                            type: "Identifier",
                            span: {
                              start: 157,
                              end: 167
                            },
                            value: "data-props"
                          },
                          value: {
                            type: "JSXExpressionContainer",
                            span: {
                              start: 168,
                              end: 191
                            },
                            expression: {
                              type: "CallExpression",
                              span: {
                                start: 169,
                                end: 190
                              },
                              ctxt: 0,
                              callee: {
                                type: "MemberExpression",
                                span: {
                                  start: 169,
                                  end: 183
                                },
                                object: {
                                  type: "Identifier",
                                  span: {
                                    start: 169,
                                    end: 173
                                  },
                                  ctxt: 1,
                                  value: "JSON",
                                  optional: false
                                },
                                property: {
                                  type: "Identifier",
                                  span: {
                                    start: 174,
                                    end: 183
                                  },
                                  value: "stringify"
                                }
                              },
                              arguments: [
                                {
                                  spread: null,
                                  expression: {
                                    type: "Identifier",
                                    span: {
                                      start: 184,
                                      end: 189
                                    },
                                    ctxt: 4,
                                    value: "props",
                                    optional: false
                                  }
                                }
                              ],
                              typeArguments: null
                            }
                          }
                        }
                      ],
                      selfClosing: true,
                      typeArguments: null
                    },
                    children: [],
                    closing: null
                  },
                  {
                    type: "JSXText",
                    span: {
                      start: 194,
                      end: 201
                    },
                    value: "\n      ",
                    raw: "\n      "
                  },
                  {
                    type: "JSXElement",
                    span: {
                      start: 201,
                      end: 443
                    },
                    opening: {
                      type: "JSXOpeningElement",
                      name: {
                        type: "Identifier",
                        span: {
                          start: 202,
                          end: 208
                        },
                        ctxt: 1,
                        value: "script",
                        optional: false
                      },
                      span: {
                        start: 201,
                        end: 443
                      },
                      attributes: [
                        {
                          type: "JSXAttribute",
                          span: {
                            start: 217,
                            end: 434
                          },
                          name: {
                            type: "Identifier",
                            span: {
                              start: 217,
                              end: 240
                            },
                            value: "dangerouslySetInnerHTML"
                          },
                          value: {
                            type: "JSXExpressionContainer",
                            span: {
                              start: 241,
                              end: 434
                            },
                            expression: {
                              type: "ObjectExpression",
                              span: {
                                start: 242,
                                end: 433
                              },
                              properties: [
                                {
                                  type: "KeyValueProperty",
                                  key: {
                                    type: "Identifier",
                                    span: {
                                      start: 254,
                                      end: 260
                                    },
                                    value: "__html"
                                  },
                                  value: {
                                    type: "TemplateLiteral",
                                    span: {
                                      start: 262,
                                      end: 423
                                    },
                                    expressions: [
                                      {
                                        type: "Identifier",
                                        span: {
                                          start: 330,
                                          end: 332
                                        },
                                        ctxt: 3,
                                        value: "id",
                                        optional: false
                                      },
                                      {
                                        type: "Identifier",
                                        span: {
                                          start: 408,
                                          end: 410
                                        },
                                        ctxt: 3,
                                        value: "id",
                                        optional: false
                                      }
                                    ],
                                    quasis: [
                                      {
                                        type: "TemplateElement",
                                        span: {
                                          start: 263,
                                          end: 328
                                        },
                                        tail: false,
                                        cooked: "(function () {\n  if (typeof $FRSC !== 'undefined') return $FRSC(\"",
                                        raw: "(function () {\n  if (typeof $FRSC !== 'undefined') return $FRSC(\""
                                      },
                                      {
                                        type: "TemplateElement",
                                        span: {
                                          start: 333,
                                          end: 406
                                        },
                                        tail: false,
                                        cooked:
                                          "\");\n  if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }\n  $FRSC_.push(\"",
                                        raw: "\");\n  if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }\n  $FRSC_.push(\""
                                      },
                                      {
                                        type: "TemplateElement",
                                        span: {
                                          start: 411,
                                          end: 422
                                        },
                                        tail: true,
                                        cooked: '");\n  })();',
                                        raw: '");\n  })();'
                                      }
                                    ]
                                  }
                                }
                              ]
                            }
                          }
                        }
                      ],
                      selfClosing: true,
                      typeArguments: null
                    },
                    children: [],
                    closing: null
                  },
                  {
                    type: "JSXText",
                    span: {
                      start: 443,
                      end: 448
                    },
                    value: "\n    ",
                    raw: "\n    "
                  }
                ],
                closing: {
                  type: "JSXClosingFragment",
                  span: {
                    start: 448,
                    end: 451
                  }
                }
              }
            },
            async: false,
            generator: false,
            typeParameters: null,
            returnType: null
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
function getClientBoundaryReplacement(id, componentName) {
  return {
    type: "VariableDeclaration",
    span: {
      start: 1,
      end: 58
    },
    ctxt: 0,
    kind: "const",
    declare: false,
    declarations: [
      {
        type: "VariableDeclarator",
        span: {
          start: 7,
          end: 57
        },
        id: {
          type: "Identifier",
          span: {
            start: 7,
            end: 18
          },
          ctxt: 2,
          value: componentName,
          optional: false,
          typeAnnotation: null
        },
        init: {
          type: "CallExpression",
          span: {
            start: 21,
            end: 57
          },
          ctxt: 0,
          callee: {
            type: "Identifier",
            span: {
              start: 21,
              end: 35
            },
            ctxt: 1,
            value: "ClientBoundary",
            optional: false
          },
          arguments: [
            {
              spread: null,
              expression: {
                type: "StringLiteral",
                span: {
                  start: 36,
                  end: 41
                },
                value: id,
                raw: `"${id}"`
              }
            },
            {
              spread: null,
              expression: {
                type: "StringLiteral",
                span: {
                  start: 43,
                  end: 56
                },
                value: componentName,
                raw: `"${componentName}"`
              }
            }
          ],
          typeArguments: null
        },
        definite: false
      }
    ]
  };
}