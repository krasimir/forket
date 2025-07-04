const path = require('path')
const fs = require('fs');
const swc = require("@swc/core");
const get = require("lodash/get");
const chalk = require("chalk");
const buildGraphs = require("./lib/graph.js");
const traverseNode = require("./lib/utils/traverseNode.js");

const POSSIBLE_TYPES = ["server", "client"];
const span = { start: 1, end: 0 };

function init() {
  let counter = 1;

  async function process(ROOT) {
    console.log(chalk.gray(`‎𐂐 Forketting ${ROOT}`));

    const graphs = await buildGraphs(ROOT);
  }
  async function transform(code, type, filepath = "", debug = false) {
    if (!type || !POSSIBLE_TYPES.includes(type)) {
      throw new Error(`Forket: Invalid type "${type}". Expected one of: ${POSSIBLE_TYPES.join(", ")}`);
    }

    const ROOT = filepath !== "" ? path.dirname(filepath) : process.cwd();

    const { transform, parse, print } = swc;
    const ast = await parse(code, {
      syntax: "typescript", // or 'ecmascript'
      tsx: true,
      decorators: false
    });
    const shouldDebug = debug && filepath !== "";
    const tmpDir = path.join(ROOT, "tmp", type);

    if (shouldDebug) {
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      } else {
        fs.readdirSync(tmpDir).forEach(file => {
          fs.unlinkSync(path.join(tmpDir, file));
        });
      }
      fs.writeFileSync(path.join(tmpDir, "input.js"), code);
      fs.writeFileSync(path.join(tmpDir, "ast.json"), JSON.stringify(ast, null, 2));
    }

    let meta = processAST(ast, type);

    if (shouldDebug) {
      fs.writeFileSync(path.join(tmpDir, "ast.transformed.json"), JSON.stringify(ast, null, 2));
    }

    const transformed = await transform(ast, {
      jsc: {
        target: "esnext", // "es3" | "es5" | "es2015" | "es2016" | "es2017" | "es2018" | "es2019" | "es2020" | "es2021" | "es2022" | "es2023" | "es2024" | "esnext"
        transform: {
          react: {
            runtime: "classic",
            pragma: "React.createElement",
            pragmaFrag: "React.Fragment",
            throwIfNamespace: true,
            development: false,
            useBuiltins: false
          }
        },
        parser: {
          syntax: "typescript", // or 'ecmascript'
          tsx: true,
          decorators: false
        }
      }
    });

    if (debug && filepath !== "") {
      fs.writeFileSync(path.join(tmpDir, "output.js"), transformed.code);
      fs.writeFileSync(path.join(tmpDir, "meta.json"), JSON.stringify(meta, null, 2));
      meta = Object.assign(meta, getDebugResults(tmpDir));
    }

    return {
      code: transformed.code,
      meta
    };
  }
  // Here's where the magic happens 🧙🏻‍♀️🔮🪄
  function processAST(ast, type) {
    let useClient = false;
    const imports = [];

    function processImports(node) {
      if (get(node, 'source.value') === "react-dom/client") {
        useClient = true;
      }
      imports.push({ source: get(node, "source.value") });
    }
    function processCallExpression(node) {
      if (get(node, 'callee.value') === "require") {
        if (get(node, "arguments[0].expression.value") === "react-dom/client") {
          useClient = true;
        }
        imports.push({ source: get(node, "arguments[0].expression.value") });
      }
    }
    function processFunction(node) {
      return;
      const isAsync = node.async;
      const funcName = node?.identifier?.value || "";
      const isClient = type === "client";

      // debugging ...
      // console.log(`Processing FunctionExpression: ${funcName} (async: ${isAsync}, jsx: ${containsJSXReturn(node)}, client: ${isClient})`);

      if (!isAsync) return;
      if (!containsJSXReturn(node)) return;

      const templateId = `forket-${counter++}`;
      // const body = {
      //   type: "BlockStatement",
      //   span: {
      //     start: 32,
      //     end: 49
      //   },
      //   ctxt: 3,
      //   stmts: [
      //     {
      //       type: "ReturnStatement",
      //       span: {
      //         start: 36,
      //         end: 47
      //       },
      //       argument: {
      //         type: "NullLiteral",
      //         span: {
      //           start: 43,
      //           end: 47
      //         }
      //       }
      //     }
      //   ]
      // };
      const returnStmt = {
        type: "ReturnStatement",
        span,
        argument: {
          type: "JSXElement",
          span: {
            start: 33,
            end: 45
          },
          opening: {
            type: "JSXOpeningElement",
            ctxt: 1,
            span,
            name: {
              type: "Identifier",
              value: "template",
              ctxt: 1,
              span
            },
            attributes: [
              {
                // id="forket-<...>"
                type: "JSXAttribute",
                span,
                name: {
                  type: "Identifier",
                  span,
                  value: "id"
                },
                value: {
                  type: "StringLiteral",
                  span,
                  value: templateId,
                  raw: '"' + templateId + '"'
                }
              }
            ],
            selfClosing: true
          },
          children: []
        }
      };

      // Replace body with our return
      node.body.stmts = [returnStmt];
      // node.body = body;

      // Remove async
      node.async = false;
    }
    function processExpressionStatement(node) {
      if (get(node, 'expression.type') === "StringLiteral" &&
          get(node, 'expression.value') === "use client") {
        useClient = true;
      }
    }

    traverseNode(ast, {
      ImportDeclaration: processImports,
      FunctionDeclaration: processFunction,
      ArrowFunctionExpression: processFunction,
      FunctionExpression: processFunction,
      CallExpression: processCallExpression,
      ExpressionStatement: processExpressionStatement
    });

    return {
      useClient,
      imports
    };
  }

  return {
    transform,
    process
  };
}
function containsJSXReturn(node) {
  let found = false;

  function deepCheck(n, isInReturnScope = false) {
    if (!n || found) return;

    if (isInReturnScope && n.type === "JSXElement") {
      found = true;
      return;
    }

    for (const key in n) {
      const child = n[key];

      if (Array.isArray(child)) {
        for (const c of child) {
          if (c && typeof c.type === "string") deepCheck(c, n.type === "ReturnStatement" || isInReturnScope);
        }
      } else if (child && typeof child.type === "string") {
        deepCheck(child, n.type === "ReturnStatement" || isInReturnScope);
      }
    }
  }

  deepCheck(node.body); // pass the block body
  return found;
}
function importFragment(ast) {
  const fragmentNode = {
    type: "ImportDeclaration",
    span,
    specifiers: [
      {
        type: "ImportSpecifier",
        span,
        local: {
          type: "Identifier",
          span,
          ctxt: 2,
          value: "Fragment",
          optional: false
        },
        imported: null,
        isTypeOnly: false
      }
    ],
    source: {
      type: "StringLiteral",
      span,
      value: "react",
      raw: "\"react\""
    },
    typeOnly: false,
    with: null,
    phase: "evaluation"
  }
  ast.body = [fragmentNode, ...ast.body];
}
function getDebugResults(dir) {
  return {
    ast: JSON.parse(fs.readFileSync(path.join(dir, "ast.json"), "utf8")),
    astTransformed: JSON.parse(fs.readFileSync(path.join(dir, "ast.transformed.json"), "utf8")),
    input: fs.readFileSync(path.join(dir, "input.js"), "utf8"),
    output: fs.readFileSync(path.join(dir, "output.js"), "utf8")
  };
}

module.exports = {
  init
};
