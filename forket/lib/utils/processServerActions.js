import traverseNode from "./traverseNode.js";
import { encrypt } from "./encryption.js";

export default function processServerAction(ast, filePath, maskPathAndFunction = encrypt) {
  const handlers = [];
  traverseNode(ast, {
    ExpressionStatement(node, stack) {
      if (node?.expression?.type === "StringLiteral" && node?.expression?.value == "use server") {
        // console.log(stack);
        const funcNode = stack[1];
        if (funcNode && funcNode?.type === "FunctionDeclaration") {
          const funcName = funcNode?.identifier?.value;
          if (!funcName) {
            return;
          }
          const meta = maskPathAndFunction(`${filePath}:${funcName}`);
          makeSureThatItIsGlobal(ast, funcNode, stack);
          setMetadata(ast, funcName, meta);
          handlers.push({ filePath, funcName, mask: meta })
        }
      }
    }
  });
  return handlers;
}

function makeSureThatItIsGlobal(ast, funcNode, stack) {
  if (ast.body.includes(funcNode)) {
    makeSureThatItIsExported(ast, funcNode);
    return;
  } else {
    // extract it to the global scope
  }
}
function makeSureThatItIsExported(ast, node) {
  for(let i=0; i<ast.body.length; i++) {
    if (ast.body[i] === node) {
      ast.body[i] = {
        type: "ExportDeclaration",
        span: {
          start: 25,
          end: 134
        },
        declaration: node
      };
    }
  }
}
function setMetadata(ast, funcName, meta) {
  traverseNode(ast, {
    JSXExpressionContainer(node) {
      if (node?.expression?.value === funcName) {
        node.expression = {
          type: "StringLiteral",
          span: {
            start: 178,
            end: 186
          },
          value: meta,
          raw: '"' + meta + '"'
        };
      }
    }
  });
}