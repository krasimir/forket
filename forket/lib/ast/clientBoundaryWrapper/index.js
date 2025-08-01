/* This file is auto-generated by Forket. Don't change it manually. */

export default function (id, componentName) {
  return {
  "type": "FunctionDeclaration",
  "identifier": {
    "type": "Identifier",
    "span": {
      "start": 10,
      "end": 23
    },
    "ctxt": 2,
    "value": componentName + "Boundary",
    "optional": false
  },
  "declare": false,
  "params": [
    {
      "type": "Parameter",
      "span": {
        "start": 24,
        "end": 29
      },
      "decorators": [],
      "pat": {
        "type": "Identifier",
        "span": {
          "start": 24,
          "end": 29
        },
        "ctxt": 3,
        "value": "props",
        "optional": false,
        "typeAnnotation": null
      }
    }
  ],
  "decorators": [],
  "span": {
    "start": 1,
    "end": 747
  },
  "ctxt": 3,
  "body": {
    "type": "BlockStatement",
    "span": {
      "start": 31,
      "end": 747
    },
    "ctxt": 3,
    "stmts": [
      {
        "type": "VariableDeclaration",
        "span": {
          "start": 35,
          "end": 103
        },
        "ctxt": 0,
        "kind": "const",
        "declare": false,
        "declarations": [
          {
            "type": "VariableDeclarator",
            "span": {
              "start": 41,
              "end": 102
            },
            "id": {
              "type": "Identifier",
              "span": {
                "start": 41,
                "end": 56
              },
              "ctxt": 3,
              "value": "serializedProps",
              "optional": false,
              "typeAnnotation": null
            },
            "init": {
              "type": "CallExpression",
              "span": {
                "start": 59,
                "end": 102
              },
              "ctxt": 0,
              "callee": {
                "type": "MemberExpression",
                "span": {
                  "start": 59,
                  "end": 73
                },
                "object": {
                  "type": "Identifier",
                  "span": {
                    "start": 59,
                    "end": 63
                  },
                  "ctxt": 1,
                  "value": "JSON",
                  "optional": false
                },
                "property": {
                  "type": "Identifier",
                  "span": {
                    "start": 64,
                    "end": 73
                  },
                  "value": "stringify"
                }
              },
              "arguments": [
                {
                  "spread": null,
                  "expression": {
                    "type": "CallExpression",
                    "span": {
                      "start": 74,
                      "end": 101
                    },
                    "ctxt": 0,
                    "callee": {
                      "type": "Identifier",
                      "span": {
                        "start": 74,
                        "end": 94
                      },
                      "ctxt": 1,
                      "value": "forketSerializeProps",
                      "optional": false
                    },
                    "arguments": [
                      {
                        "spread": null,
                        "expression": {
                          "type": "Identifier",
                          "span": {
                            "start": 95,
                            "end": 100
                          },
                          "ctxt": 3,
                          "value": "props",
                          "optional": false
                        }
                      }
                    ],
                    "typeArguments": null
                  }
                }
              ],
              "typeArguments": null
            },
            "definite": false
          }
        ]
      },
      {
        "type": "VariableDeclaration",
        "span": {
          "start": 106,
          "end": 144
        },
        "ctxt": 0,
        "kind": "const",
        "declare": false,
        "declarations": [
          {
            "type": "VariableDeclarator",
            "span": {
              "start": 112,
              "end": 143
            },
            "id": {
              "type": "Identifier",
              "span": {
                "start": 112,
                "end": 120
              },
              "ctxt": 3,
              "value": "children",
              "optional": false,
              "typeAnnotation": null
            },
            "init": {
              "type": "BinaryExpression",
              "span": {
                "start": 123,
                "end": 143
              },
              "operator": "||",
              "left": {
                "type": "MemberExpression",
                "span": {
                  "start": 123,
                  "end": 137
                },
                "object": {
                  "type": "Identifier",
                  "span": {
                    "start": 123,
                    "end": 128
                  },
                  "ctxt": 3,
                  "value": "props",
                  "optional": false
                },
                "property": {
                  "type": "Identifier",
                  "span": {
                    "start": 129,
                    "end": 137
                  },
                  "value": "children"
                }
              },
              "right": {
                "type": "ArrayExpression",
                "span": {
                  "start": 141,
                  "end": 143
                },
                "elements": []
              }
            },
            "definite": false
          }
        ]
      },
      {
        "type": "ReturnStatement",
        "span": {
          "start": 147,
          "end": 745
        },
        "argument": {
          "type": "ParenthesisExpression",
          "span": {
            "start": 154,
            "end": 744
          },
          "expression": {
            "type": "JSXFragment",
            "span": {
              "start": 160,
              "end": 740
            },
            "opening": {
              "type": "JSXOpeningFragment",
              "span": {
                "start": 160,
                "end": 162
              }
            },
            "children": [
              {
                "type": "JSXText",
                "span": {
                  "start": 162,
                  "end": 169
                },
                "value": "\n      ",
                "raw": "\n      "
              },
              {
                "type": "JSXElement",
                "span": {
                  "start": 169,
                  "end": 226
                },
                "opening": {
                  "type": "JSXOpeningElement",
                  "name": {
                    "type": "Identifier",
                    "span": {
                      "start": 170,
                      "end": 191
                    },
                    "ctxt": 1,
                    "value": "boundary_children_" + id,
                    "optional": false
                  },
                  "span": {
                    "start": 169,
                    "end": 192
                  },
                  "attributes": [],
                  "selfClosing": false,
                  "typeArguments": null
                },
                "children": [
                  {
                    "type": "JSXExpressionContainer",
                    "span": {
                      "start": 192,
                      "end": 202
                    },
                    "expression": {
                      "type": "Identifier",
                      "span": {
                        "start": 193,
                        "end": 201
                      },
                      "ctxt": 3,
                      "value": "children",
                      "optional": false
                    }
                  }
                ],
                "closing": {
                  "type": "JSXClosingElement",
                  "span": {
                    "start": 202,
                    "end": 226
                  },
                  "name": {
                    "type": "Identifier",
                    "span": {
                      "start": 204,
                      "end": 225
                    },
                    "ctxt": 1,
                    "value": "boundary_children_" + id,
                    "optional": false
                  }
                }
              },
              {
                "type": "JSXText",
                "span": {
                  "start": 226,
                  "end": 233
                },
                "value": "\n      ",
                "raw": "\n      "
              },
              {
                "type": "JSXElement",
                "span": {
                  "start": 233,
                  "end": 310
                },
                "opening": {
                  "type": "JSXOpeningElement",
                  "name": {
                    "type": "Identifier",
                    "span": {
                      "start": 234,
                      "end": 252
                    },
                    "ctxt": 1,
                    "value": "boundary_props_" + id,
                    "optional": false
                  },
                  "span": {
                    "start": 233,
                    "end": 310
                  },
                  "attributes": [
                    {
                      "type": "JSXAttribute",
                      "span": {
                        "start": 253,
                        "end": 307
                      },
                      "name": {
                        "type": "Identifier",
                        "span": {
                          "start": 253,
                          "end": 276
                        },
                        "value": "dangerouslySetInnerHTML"
                      },
                      "value": {
                        "type": "JSXExpressionContainer",
                        "span": {
                          "start": 277,
                          "end": 307
                        },
                        "expression": {
                          "type": "ObjectExpression",
                          "span": {
                            "start": 278,
                            "end": 306
                          },
                          "properties": [
                            {
                              "type": "KeyValueProperty",
                              "key": {
                                "type": "Identifier",
                                "span": {
                                  "start": 280,
                                  "end": 286
                                },
                                "value": "__html"
                              },
                              "value": {
                                "type": "Identifier",
                                "span": {
                                  "start": 288,
                                  "end": 303
                                },
                                "ctxt": 3,
                                "value": "serializedProps",
                                "optional": false
                              }
                            }
                          ]
                        }
                      }
                    }
                  ],
                  "selfClosing": true,
                  "typeArguments": null
                },
                "children": [],
                "closing": null
              },
              {
                "type": "JSXText",
                "span": {
                  "start": 310,
                  "end": 317
                },
                "value": "\n      ",
                "raw": "\n      "
              },
              {
                "type": "JSXElement",
                "span": {
                  "start": 317,
                  "end": 633
                },
                "opening": {
                  "type": "JSXOpeningElement",
                  "name": {
                    "type": "Identifier",
                    "span": {
                      "start": 318,
                      "end": 336
                    },
                    "ctxt": 1,
                    "value": "boundary_setup_" + id,
                    "optional": false
                  },
                  "span": {
                    "start": 317,
                    "end": 633
                  },
                  "attributes": [
                    {
                      "type": "JSXAttribute",
                      "span": {
                        "start": 345,
                        "end": 624
                      },
                      "name": {
                        "type": "Identifier",
                        "span": {
                          "start": 345,
                          "end": 368
                        },
                        "value": "dangerouslySetInnerHTML"
                      },
                      "value": {
                        "type": "JSXExpressionContainer",
                        "span": {
                          "start": 369,
                          "end": 624
                        },
                        "expression": {
                          "type": "ObjectExpression",
                          "span": {
                            "start": 370,
                            "end": 623
                          },
                          "properties": [
                            {
                              "type": "KeyValueProperty",
                              "key": {
                                "type": "Identifier",
                                "span": {
                                  "start": 382,
                                  "end": 388
                                },
                                "value": "__html"
                              },
                              "value": {
                                "type": "TemplateLiteral",
                                "span": {
                                  "start": 390,
                                  "end": 613
                                },
                                "expressions": [],
                                "quasis": [
                                  {
                                    "type": "TemplateElement",
                                    "span": {
                                      "start": 391,
                                      "end": 612
                                    },
                                    "tail": true,
                                    "cooked": "(function () {\n          if (typeof $FRSC !== 'undefined') return $FRSC([\"" + id + "\", \"" + componentName + "\"]);\n          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }\n          $FRSC_.push([\"" + id + "\", \"" + componentName + "\"]);\n        })();",
                                    "raw": "(function () {\n          if (typeof $FRSC !== 'undefined') return $FRSC([\"" + id + "\", \"" + componentName + "\"]);\n          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }\n          $FRSC_.push([\"" + id + "\", \"" + componentName + "\"]);\n        })();"
                                  }
                                ]
                              }
                            }
                          ]
                        }
                      }
                    }
                  ],
                  "selfClosing": true,
                  "typeArguments": null
                },
                "children": [],
                "closing": null
              },
              {
                "type": "JSXText",
                "span": {
                  "start": 633,
                  "end": 640
                },
                "value": "\n      ",
                "raw": "\n      "
              },
              {
                "type": "JSXElement",
                "span": {
                  "start": 640,
                  "end": 732
                },
                "opening": {
                  "type": "JSXOpeningElement",
                  "name": {
                    "type": "Identifier",
                    "span": {
                      "start": 641,
                      "end": 653
                    },
                    "ctxt": 1,
                    "value": "boundary_" + id,
                    "optional": false
                  },
                  "span": {
                    "start": 640,
                    "end": 654
                  },
                  "attributes": [],
                  "selfClosing": false,
                  "typeArguments": null
                },
                "children": [
                  {
                    "type": "JSXText",
                    "span": {
                      "start": 654,
                      "end": 663
                    },
                    "value": "\n        ",
                    "raw": "\n        "
                  },
                  {
                    "type": "JSXElement",
                    "span": {
                      "start": 663,
                      "end": 710
                    },
                    "opening": {
                      "type": "JSXOpeningElement",
                      "name": {
                        "type": "Identifier",
                        "span": {
                          "start": 664,
                          "end": 676
                        },
                        "ctxt": 1,
                        "value": componentName,
                        "optional": false
                      },
                      "span": {
                        "start": 663,
                        "end": 710
                      },
                      "attributes": [
                        {
                          "type": "SpreadElement",
                          "spread": {
                            "start": 678,
                            "end": 681
                          },
                          "arguments": {
                            "type": "Identifier",
                            "span": {
                              "start": 681,
                              "end": 686
                            },
                            "ctxt": 3,
                            "value": "props",
                            "optional": false
                          }
                        },
                        {
                          "type": "JSXAttribute",
                          "span": {
                            "start": 688,
                            "end": 707
                          },
                          "name": {
                            "type": "Identifier",
                            "span": {
                              "start": 688,
                              "end": 696
                            },
                            "value": "children"
                          },
                          "value": {
                            "type": "JSXExpressionContainer",
                            "span": {
                              "start": 697,
                              "end": 707
                            },
                            "expression": {
                              "type": "Identifier",
                              "span": {
                                "start": 698,
                                "end": 706
                              },
                              "ctxt": 3,
                              "value": "children",
                              "optional": false
                            }
                          }
                        }
                      ],
                      "selfClosing": true,
                      "typeArguments": null
                    },
                    "children": [],
                    "closing": null
                  },
                  {
                    "type": "JSXText",
                    "span": {
                      "start": 710,
                      "end": 717
                    },
                    "value": "\n      ",
                    "raw": "\n      "
                  }
                ],
                "closing": {
                  "type": "JSXClosingElement",
                  "span": {
                    "start": 717,
                    "end": 732
                  },
                  "name": {
                    "type": "Identifier",
                    "span": {
                      "start": 719,
                      "end": 731
                    },
                    "ctxt": 1,
                    "value": "boundary_" + id,
                    "optional": false
                  }
                }
              },
              {
                "type": "JSXText",
                "span": {
                  "start": 732,
                  "end": 737
                },
                "value": "\n    ",
                "raw": "\n    "
              }
            ],
            "closing": {
              "type": "JSXClosingFragment",
              "span": {
                "start": 737,
                "end": 740
              }
            }
          }
        }
      }
    ]
  },
  "generator": false,
  "async": false,
  "typeParameters": null,
  "returnType": null
}
}