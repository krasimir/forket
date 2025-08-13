import traverseNode from "./traverseNode.js";
import insertAtTheTop from "./insertAtTheTop.js";
import getId from "./getId.js";

export default function processServerActions(node, serverActionsContainingNodes, current = []) {
  const serverActionsHandlers = [];

  // Dealing with the cases when the action is in the same file
  if (node.serverActions && node.serverActions.length > 0) {
    node.serverActions.forEach(({ funcName, funcNode, stack, isDefault }) => {
      // console.log("++++ Spotted in the same file", node.file);
      const handler = createActionHandler({
        filePath: node.file,
        funcName,
        serverActionClientId: `$FSA_${getId()}`,
        isDefault: !!isDefault
      });
      setServerActionId(node.ast, funcName, handler.serverActionClientId);
      if (funcNode && funcNode?.type === "FunctionDeclaration") {
        makeSureThatItIsGlobal(node.ast, stack[1], stack);
      } else if (funcNode && funcNode?.type === "ArrowFunctionExpression") {
        makeSureThatItIsGlobal(node.ast, stack[3], stack);
      } else if (funcNode && funcNode?.type === "FunctionExpression") {
        makeSureThatItIsGlobal(node.ast, stack[3], stack);
      }
    });
  }

  // Dealing with the cases when the action is imported
  traverseNode(node.ast, {
    JSXOpeningElement(n) {
      (n?.attributes || []).forEach((attr) => {
        if (attr?.value?.type === "JSXExpressionContainer") {
          const potentialServerAction = attr?.value?.expression?.value;
          // console.log('----------------------------------------------------' + node.file);
          // console.log("potentialServerAction=" + potentialServerAction);
          const foundAsImported = node.imports.find((imp) => {
            return (imp?.what || []).some((w) => w === potentialServerAction);
          });
          if (foundAsImported) {
            // console.log("foundAsImported", foundAsImported);
            const nodeThatContainsTheServerAction = serverActionsContainingNodes.find((n) => {
              return (
                foundAsImported.resolvedTo === n.file &&
                n.serverActions.find((sa) => sa.funcName === potentialServerAction)
              );
            });
            if (nodeThatContainsTheServerAction) {
              // console.log("nodeThatContainsTheServerAction");
              const foundServerAction = nodeThatContainsTheServerAction.serverActions.find(
                (sa) => sa.funcName === potentialServerAction
              );
              const handler = createActionHandler({
                filePath: nodeThatContainsTheServerAction.file,
                funcName: potentialServerAction,
                serverActionClientId: `$FSA_${getId()}`,
                isDefault: !!foundServerAction?.isDefault
              });
              setServerActionId(node.ast, potentialServerAction, handler.serverActionClientId);
            }
          }
        }
      });
    }
  });

  function createActionHandler(action) {
    // console.log('createActionHandler', action);
    const found = current.find((a) => a.funcName === action.funcName && a.filePath === action.filePath);
    if (found) {
      // console.log('--- !!! ---');
      return found;
    }
    serverActionsHandlers.push(action);
    return action;
  }

  return serverActionsHandlers;
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