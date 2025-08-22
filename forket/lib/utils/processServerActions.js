import traverseNode from "./traverseNode.js";
import insertAtTheTop from "./insertAtTheTop.js";
import clientSideServerActionCall from "../ast/clientSideServerActionCall/index.js";

export function processServerActions(node, serverActionsContainingNodes, current = []) {
  const serverActionsHandlers = [];
  // Dealing with the cases when the action is in the same file
  if (node.serverActions && node.serverActions.length > 0) {
    node.serverActions.forEach(({ funcName, funcNode, stack, isDefault, insideJSXAttribute, jsxAttribute }) => {
      // console.log("++++ Spotted in the same file", node.file);
      if (insideJSXAttribute) {
        insertAtTheTop(node.ast, getArrayFunctionIntoVariable(funcName, funcNode));
        traverseNode(node.ast, {
          JSXAttribute(n) {
            if (n?.name?.value === jsxAttribute && n?.value?.expression === funcNode) {
              n.value = getExpressionContainer(funcName);
            }
          }
        });
      }
      const handler = createActionHandler({
        filePath: node.file,
        funcName,
        serverActionClientId: `$FSA_${funcName}`,
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
                serverActionClientId: `$FSA_${potentialServerAction}`,
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
    const found = current.find((a) => a.funcName === action.funcName && a.filePath === action.filePath);
    if (found) {
      return found;
    }
    serverActionsHandlers.push(action);
    return action;
  }

  return serverActionsHandlers;
}
export function dealWithSAImportedInClientNode(node, importEntry) {
  let serverActions = [];
  node.ast.body = node.ast.body.filter(n => {
    if (n.type === "ImportDeclaration" && n?.source?.value === importEntry.source) {
      (n?.specifiers || []).forEach((s) => {
        if (s.type === "ImportSpecifier" || s.type === 'ImportDefaultSpecifier') {
          const funcName = s?.local?.value;
          const serverActionClientId = `$FSA_${funcName}`;
          serverActions.push({
            filePath: importEntry.resolvedTo,
            funcName,
            serverActionClientId,
            isDefault: s.type === "ImportDefaultSpecifier"
          });
        }
      });
      return false;
    } else if (n.type === "VariableDeclaration") {
      const declaration = (n?.declarations || []).find((d) => {
        return (d?.init?.arguments || []).find((a) => a?.expression?.value === importEntry.source)
      })
      if (declaration?.id?.type === "Identifier" && declaration?.id?.value) {
        const funcName = declaration?.id?.value;
        const serverActionClientId = `$FSA_${funcName}`;
        serverActions.push({
          filePath: importEntry.resolvedTo,
          funcName,
          serverActionClientId,
          isDefault: true
        });
      } else if (declaration?.id?.type === "ObjectPattern") {
        (declaration?.id?.properties || []).forEach(p => {
          if (p?.key.type === "Identifier" && p?.key?.value) {
            const funcName = p.key.value;
            const serverActionClientId = `$FSA_${funcName}`;
            serverActions.push({
              filePath: importEntry.resolvedTo,
              funcName,
              serverActionClientId,
              isDefault: false
            });
          }
        })
      }
      return !(!!declaration);
    }
    return true;
  })
  serverActions = removeDuplicates(serverActions);

  serverActions.forEach(({ serverActionClientId, funcName }) => {
    insertAtTheTop(node.ast, clientSideServerActionCall(serverActionClientId, funcName));
  });

  return serverActions;
}
export function removeDuplicates(serverActions) {
  return serverActions.reduce((acc, curr) => {
    if (!acc.find(a => a.funcName === curr.funcName && a.filePath === curr.filePath)) {
      acc.push(curr);
    }
    return acc;
  }, []);
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
function getArrayFunctionIntoVariable(funcName, funcNode) {
  return {
      "type": "ExportDeclaration",
      "span": {
        "start": 1,
        "end": 52
      },
      "declaration": {
    type: "VariableDeclaration",
    span: {
      start: 1,
      end: 45
    },
    ctxt: 0,
    kind: "const",
    declare: false,
    declarations: [
      {
        type: "VariableDeclarator",
        span: {
          start: 7,
          end: 45
        },
        id: {
          type: "Identifier",
          span: {
            start: 7,
            end: 10
          },
          ctxt: 2,
          value: funcName,
          optional: false,
          typeAnnotation: null
        },
        init: funcNode,
        definite: false
      }
    ]
  }
}
}
function getExpressionContainer(value) {
  return {
    type: "JSXExpressionContainer",
    span: {
      start: 49,
      end: 55
    },
    expression: {
      type: "Identifier",
      span: {
        start: 50,
        end: 54
      },
      ctxt: 1,
      value,
      optional: false
    }
  };
}