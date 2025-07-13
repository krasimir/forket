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
          } else {
            // return await transformForClientUsage(graph, node);
          }
        }
      }
      return false;
    }
  }
  async function createClientBoundary(graph, node, imp, importedNode) {
    console.log("------->", imp.source);

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
        insertAfterImports(node.ast, getClientBoundaryReplacement(getId(), compName));
      });
      insertAfterImports(node.ast, getPropsSerializer());
    }

    // Generating the new code
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
function getClientBoundaryReplacement(id, componentName) {
  return {
    type: "FunctionDeclaration",
    identifier: {
      type: "Identifier",
      span: {
        start: 10,
        end: 30
      },
      ctxt: 2,
      value: componentName + "Boundary",
      optional: false
    },
    declare: false,
    params: [
      {
        type: "Parameter",
        span: {
          start: 31,
          end: 36
        },
        decorators: [],
        pat: {
          type: "Identifier",
          span: {
            start: 31,
            end: 36
          },
          ctxt: 3,
          value: "props",
          optional: false,
          typeAnnotation: null
        }
      }
    ],
    decorators: [],
    span: {
      start: 1,
      end: 488
    },
    ctxt: 3,
    body: {
      type: "BlockStatement",
      span: {
        start: 38,
        end: 488
      },
      ctxt: 3,
      stmts: [
        {
          type: "VariableDeclaration",
          span: {
            start: 42,
            end: 89
          },
          ctxt: 0,
          kind: "const",
          declare: false,
          declarations: [
            {
              type: "VariableDeclarator",
              span: {
                start: 48,
                end: 88
              },
              id: {
                type: "Identifier",
                span: {
                  start: 48,
                  end: 63
                },
                ctxt: 3,
                value: "serializedProps",
                optional: false,
                typeAnnotation: null
              },
              init: {
                type: "CallExpression",
                span: {
                  start: 66,
                  end: 88
                },
                ctxt: 0,
                callee: {
                  type: "Identifier",
                  span: {
                    start: 66,
                    end: 81
                  },
                  ctxt: 2,
                  value: "serialize$Props",
                  optional: false
                },
                arguments: [
                  {
                    spread: null,
                    expression: {
                      type: "Identifier",
                      span: {
                        start: 82,
                        end: 87
                      },
                      ctxt: 3,
                      value: "props",
                      optional: false
                    }
                  }
                ],
                typeArguments: null
              },
              definite: false
            }
          ]
        },
        {
          type: "ReturnStatement",
          span: {
            start: 92,
            end: 486
          },
          argument: {
            type: "ParenthesisExpression",
            span: {
              start: 99,
              end: 485
            },
            expression: {
              type: "JSXFragment",
              span: {
                start: 105,
                end: 481
              },
              opening: {
                type: "JSXOpeningFragment",
                span: {
                  start: 105,
                  end: 107
                }
              },
              children: [
                {
                  type: "JSXText",
                  span: {
                    start: 107,
                    end: 114
                  },
                  value: "\n      ",
                  raw: "\n      "
                },
                {
                  type: "JSXElement",
                  span: {
                    start: 114,
                    end: 186
                  },
                  opening: {
                    type: "JSXOpeningElement",
                    name: {
                      type: "Identifier",
                      span: {
                        start: 115,
                        end: 127
                      },
                      ctxt: 1,
                      value: "boundary_" + id,
                      optional: false
                    },
                    span: {
                      start: 114,
                      end: 128
                    },
                    attributes: [],
                    selfClosing: false,
                    typeArguments: null
                  },
                  children: [
                    {
                      type: "JSXText",
                      span: {
                        start: 128,
                        end: 137
                      },
                      value: "\n        ",
                      raw: "\n        "
                    },
                    {
                      type: "JSXElement",
                      span: {
                        start: 137,
                        end: 164
                      },
                      opening: {
                        type: "JSXOpeningElement",
                        name: {
                          type: "Identifier",
                          span: {
                            start: 138,
                            end: 150
                          },
                          ctxt: 1,
                          value: componentName,
                          optional: false
                        },
                        span: {
                          start: 137,
                          end: 164
                        },
                        attributes: [
                          {
                            type: "SpreadElement",
                            spread: {
                              start: 152,
                              end: 155
                            },
                            arguments: {
                              type: "Identifier",
                              span: {
                                start: 155,
                                end: 160
                              },
                              ctxt: 3,
                              value: "props",
                              optional: false
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
                        start: 164,
                        end: 171
                      },
                      value: "\n      ",
                      raw: "\n      "
                    }
                  ],
                  closing: {
                    type: "JSXClosingElement",
                    span: {
                      start: 171,
                      end: 186
                    },
                    name: {
                      type: "Identifier",
                      span: {
                        start: 173,
                        end: 185
                      },
                      ctxt: 1,
                      value: "boundary_" + id,
                      optional: false
                    }
                  }
                },
                {
                  type: "JSXText",
                  span: {
                    start: 186,
                    end: 193
                  },
                  value: "\n      ",
                  raw: "\n      "
                },
                {
                  type: "JSXElement",
                  span: {
                    start: 193,
                    end: 473
                  },
                  opening: {
                    type: "JSXOpeningElement",
                    name: {
                      type: "Identifier",
                      span: {
                        start: 194,
                        end: 200
                      },
                      ctxt: 1,
                      value: "script",
                      optional: false
                    },
                    span: {
                      start: 193,
                      end: 473
                    },
                    attributes: [
                      {
                        type: "JSXAttribute",
                        span: {
                          start: 209,
                          end: 464
                        },
                        name: {
                          type: "Identifier",
                          span: {
                            start: 209,
                            end: 232
                          },
                          value: "dangerouslySetInnerHTML"
                        },
                        value: {
                          type: "JSXExpressionContainer",
                          span: {
                            start: 233,
                            end: 464
                          },
                          expression: {
                            type: "ObjectExpression",
                            span: {
                              start: 234,
                              end: 463
                            },
                            properties: [
                              {
                                type: "KeyValueProperty",
                                key: {
                                  type: "Identifier",
                                  span: {
                                    start: 246,
                                    end: 252
                                  },
                                  value: "__html"
                                },
                                value: {
                                  type: "TemplateLiteral",
                                  span: {
                                    start: 254,
                                    end: 453
                                  },
                                  expressions: [
                                    {
                                      type: "Identifier",
                                      span: {
                                        start: 329,
                                        end: 344
                                      },
                                      ctxt: 3,
                                      value: "serializedProps",
                                      optional: false
                                    },
                                    {
                                      type: "Identifier",
                                      span: {
                                        start: 427,
                                        end: 442
                                      },
                                      ctxt: 3,
                                      value: "serializedProps",
                                      optional: false
                                    }
                                  ],
                                  quasis: [
                                    {
                                      type: "TemplateElement",
                                      span: {
                                        start: 255,
                                        end: 327
                                      },
                                      tail: false,
                                      cooked:
                                        "(function () {\n  if (typeof $FRSC !== 'undefined') return $FRSC([\"" + id + "\", \"" + componentName + "\", ",
                                      raw: "(function () {\n  if (typeof $FRSC !== 'undefined') return $FRSC([\"" + id + "\", \"" + componentName + "\", "
                                    },
                                    {
                                      type: "TemplateElement",
                                      span: {
                                        start: 345,
                                        end: 425
                                      },
                                      tail: false,
                                      cooked:
                                        "]);\n  if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }\n  $FRSC_.push([\"" + id + "\", \"" + componentName + "\"",
                                      raw: "]);\n  if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }\n  $FRSC_.push([\"" + id + "\", \"" + componentName + "\", "
                                    },
                                    {
                                      type: "TemplateElement",
                                      span: {
                                        start: 443,
                                        end: 452
                                      },
                                      tail: true,
                                      cooked: "]);\n})();",
                                      raw: "]);\n})();"
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
                    start: 473,
                    end: 478
                  },
                  value: "\n    ",
                  raw: "\n    "
                }
              ],
              closing: {
                type: "JSXClosingFragment",
                span: {
                  start: 478,
                  end: 481
                }
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
function getPropsSerializer() {
  return {
    type: "FunctionDeclaration",
    identifier: {
      type: "Identifier",
      span: {
        start: 171,
        end: 186
      },
      ctxt: 2,
      value: "serialize$Props",
      optional: false
    },
    declare: false,
    params: [
      {
        type: "Parameter",
        span: {
          start: 187,
          end: 192
        },
        decorators: [],
        pat: {
          type: "Identifier",
          span: {
            start: 187,
            end: 192
          },
          ctxt: 4,
          value: "props",
          optional: false,
          typeAnnotation: null
        }
      }
    ],
    decorators: [],
    span: {
      start: 162,
      end: 229
    },
    ctxt: 4,
    body: {
      type: "BlockStatement",
      span: {
        start: 194,
        end: 229
      },
      ctxt: 4,
      stmts: [
        {
          type: "ReturnStatement",
          span: {
            start: 198,
            end: 227
          },
          argument: {
            type: "CallExpression",
            span: {
              start: 205,
              end: 226
            },
            ctxt: 0,
            callee: {
              type: "MemberExpression",
              span: {
                start: 205,
                end: 219
              },
              object: {
                type: "Identifier",
                span: {
                  start: 205,
                  end: 209
                },
                ctxt: 1,
                value: "JSON",
                optional: false
              },
              property: {
                type: "Identifier",
                span: {
                  start: 210,
                  end: 219
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
                    start: 220,
                    end: 225
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
      ]
    },
    generator: false,
    async: false,
    typeParameters: null,
    returnType: null
  };
}