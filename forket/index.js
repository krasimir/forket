const path = require('path')
const fs = require('fs');
const swc = require("@swc/core");

const POSSIBLE_TYPES = ["server", "client"];

function init() {
  let counter = 1;

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
      }
      fs.writeFileSync(path.join(tmpDir, "input.js"), code);
      fs.writeFileSync(path.join(tmpDir, "ast.json"), JSON.stringify(ast, null, 2));
    }

    const meta = processAST(ast, type);

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
    }

    return transformed.code;
  }
  function processAST(ast, type) {
    function ProcessFunction(node) {
      const isAsync = node.async;
      const funcName = node?.identifier?.value || "";
      // const isCapitalized = /^[A-Z]/.test(funcName); // Nice to check but it is not valid for arrow functions
      const isClient = type === "client";
      
      // debugging ...
      // if (node.type === 'FunctionExpression') {
      //   console.log(`Processing FunctionExpression: ${funcName} (async: ${isAsync}, jsx: ${containsJSXReturn(node)}, client: ${isClient})`);
      // }

      if (!isAsync) return;
      if (!containsJSXReturn(node)) return;
      if (!isClient) return;

      const templateId = `forket-${counter++}`;
      const span = { start: 1, end: 0 };
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

      // Remove async
      node.async = false;
    }
    traverseNode(ast, {
      FunctionDeclaration: ProcessFunction,
      ArrowFunctionExpression: ProcessFunction,
      FunctionExpression: ProcessFunction
    });
  }

  return {
    transform
  }
}

function traverseNode(node, visitors, parent = null) {
  if (!node || typeof node.type !== "string") return;

  const visitor = visitors[node.type];
  if (visitor) {
    visitor(node, parent);
  }

  for (const key in node) {
    if (!node.hasOwnProperty(key)) continue;

    const child = node[key];

    if (Array.isArray(child)) {
      child.forEach((c) => {
        if (c && typeof c.type === "string") {
          traverseNode(c, visitors, node);
        }
      });
    } else if (child && typeof child.type === "string") {
      traverseNode(child, visitors, node);
    }
  }
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

module.exports = {
  init
};
