import traverseNode from "./traverseNode.js";
import { encrypt } from "./encryption.js";
import insertAtTheTop from "./insertAtTheTop.js";

export default function processServerAction(ast, filePath, maskPath = encrypt) {
  const handlers = [];
  traverseNode(ast, {
    ExpressionStatement(node, stack) {
      if (node?.expression?.type === "StringLiteral" && node?.expression?.value == "use server") {
        // console.log(stack);
        // console.log(stack.map(n => n?.type));
        const funcNode = stack[1];
        if (funcNode && funcNode?.type === "FunctionDeclaration") {
          const funcName = funcNode?.identifier?.value;
          if (!funcName) {
            return;
          }
          const meta = maskPath(`${filePath}:${funcName}`);
          makeSureThatItIsGlobal(ast, stack[1], stack);
          setMetadata(ast, funcName, meta);
          handlers.push({ filePath, funcName, mask: meta })
        } else if (funcNode && funcNode?.type === "ArrowFunctionExpression") {
          const funcName = stack[2]?.id?.value;
          if (!funcName) {
            return;
          }
          const meta = maskPath(`${filePath}:${funcName}`);
          makeSureThatItIsGlobal(ast, stack[3], stack);
          setMetadata(ast, funcName, meta);
          handlers.push({ filePath, funcName, mask: meta });
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
    for(let i=0; i<stack.length; i++) {
      if (stack[i] === funcNode) {
        const parent = stack[i + 1];
        if (parent && parent?.stmts) {
          parent.stmts = parent.stmts.filter((n) => n !== funcNode);
          insertAtTheTop(ast, funcNode);
          makeSureThatItIsExported(ast, funcNode);
        }
      }
    }
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