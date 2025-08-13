import traverseNode from "./traverseNode.js";
import insertAtTheTop from "./insertAtTheTop.js";
import {printGraph} from "../graph.js";

export default function processServerAction(node, graph, clientComponents) {
  const handlers = [];
  
  printGraph(graph);

  if (node.serverActions) {
    node.serverActions.forEach(({ id, funcName, funcNode, stack }) => {
      const serverActionClientId = `$FSA_${id}`;
      setServerActionId(node.ast, funcName, serverActionClientId);
      if (funcNode && funcNode?.type === "FunctionDeclaration") {
        makeSureThatItIsGlobal(node.ast, stack[1], stack);
      } else if (funcNode && funcNode?.type === "ArrowFunctionExpression") {
        makeSureThatItIsGlobal(node.ast, stack[3], stack);
      }
      handlers.push({ filePath: node.file, funcName, serverActionClientId });
    })
  }
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
function setServerActionId(ast, funcName, meta) {
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