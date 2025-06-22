const path = require('path')
const fs = require('fs');
const swc = require("@swc/core");

const POSSIBLE_TYPES = ["server", "client"];

async function transform(code, type, filepath = '', debug = false) {
  if (!type || !POSSIBLE_TYPES.includes(type)) {
    throw new Error(`Forket: Invalid type "${type}". Expected one of: ${POSSIBLE_TYPES.join(", ")}`);
  }

  const ROOT = filepath !== '' ? path.dirname(filepath) : process.cwd();

  const { transform, parse, print } = swc;
  const ast = await parse(code, {
    syntax: "typescript", // or 'ecmascript'
    tsx: true,
    decorators: false
  });

  if (debug && filepath !== '') {
    const tmpDir = path.join(ROOT, "tmp", type);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(path.join(tmpDir, path.basename(filepath) + ".input.js"), code);
    fs.writeFileSync(path.join(tmpDir, path.basename(filepath) + ".ast.json"), JSON.stringify(ast, null, 2));
  }

  processAST(ast);

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

  if (debug && filepath !== '') {
    const tmpDir = path.join(ROOT, "tmp", type);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }
    fs.writeFileSync(path.join(tmpDir, path.basename(filepath) + ".output.js"), transformed.code);
  }

  return transformed.code;
}

function processAST(ast) {
  let counter = 0;
  traverseNode(ast, {
    FunctionDeclaration(node) {
      const isAsync = node.async;
      const isCapitalized = /^[A-Z]/.test(node?.id?.name);

      if (!isCapitalized || !isAsync) return;
      if (!containsJSXReturn(node)) return;

      const id = `template-${counter++}`;

      // Build: return <template id="template-0"></template>;
      const templateId = `template-${counter++}`;
      const returnStmt = {
        type: "ReturnStatement",
        argument: {
          type: "JSXElement",
          openingElement: {
            type: "JSXOpeningElement",
            name: { type: "JSXIdentifier", name: "template" },
            attributes: [
              {
                type: "JSXAttribute",
                name: { type: "JSXIdentifier", name: "id" },
                value: { type: "StringLiteral", value: templateId }
              }
            ],
            selfClosing: false
          },
          closingElement: {
            type: "JSXClosingElement",
            name: { type: "JSXIdentifier", name: "template" }
          },
          children: []
        }
      };

      // Replace body with our return
      node.body.body = [returnStmt];

      // Remove async
      node.async = false;
    }
  });
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

  function deepCheck(n) {
    if (!n || found) return;

    if (n.type === "ReturnStatement" && n.argument?.type === "JSXElement") {
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

  deepCheck(node.body); // pass the block body
  return found;
}

module.exports = { 
  transform
}
