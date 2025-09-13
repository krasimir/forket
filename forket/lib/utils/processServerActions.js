import traverseNode from "./traverseNode.js";
import insertAtTheTop from "./insertAtTheTop.js";
import clientSideServerActionCall from "../ast/clientSideServerActionCall/index.js";
import getId from "./getId.js";

export function processServerActions(node, serverActionsContainingNodes, serverActions) {
  const createServerAction = createServerActionFactory(serverActions);

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
      const handler = createServerAction({
        filePath: node.file,
        funcName,
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

  // Replaceing the function inside a JSX attribute with the generated id
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
              const handler = createServerAction({
                filePath: nodeThatContainsTheServerAction.file,
                funcName: potentialServerAction,
                isDefault: !!foundServerAction?.isDefault
              });
              setServerActionId(node.ast, potentialServerAction, handler.serverActionClientId);
            }
          }
        }
      });
    }
  });
}
export function dealWithSAImportedInClientNode(node, importEntry, serverActions) {
  const createServerAction = createServerActionFactory(serverActions);
  const foundInThisFile = [];
  const registerForMockingAtTheTop = createServerActionFactory(foundInThisFile);
  node.ast.body = node.ast.body.filter((n) => {
    if (n.type === "ImportDeclaration" && n?.source?.value === importEntry.source) {
      (n?.specifiers || []).forEach((s) => {
        if (s.type === "ImportSpecifier" || s.type === "ImportDefaultSpecifier") {
          // console.log("Found import of server action in client component", s.type, clearPath(node.file));
          const funcName = s?.local?.value;
          const action = createServerAction({
            filePath: importEntry.resolvedTo,
            funcName,
            isDefault: s.type === "ImportDefaultSpecifier"
          });
          registerForMockingAtTheTop(action);
        }
      });
      return false;
    } else if (n.type === "VariableDeclaration") {
      const declaration = (n?.declarations || []).find((d) => {
        return (d?.init?.arguments || []).find((a) => a?.expression?.value === importEntry.source);
      });
      if (declaration?.id?.type === "Identifier" && declaration?.id?.value) {
        const funcName = declaration?.id?.value;
        const action = createServerAction({
          filePath: importEntry.resolvedTo,
          funcName,
          isDefault: true
        });
        registerForMockingAtTheTop(action);
      } else if (declaration?.id?.type === "ObjectPattern") {
        (declaration?.id?.properties || []).forEach((p) => {
          if (p?.key.type === "Identifier" && p?.key?.value) {
            const funcName = p.key.value;
            const action = createServerAction({
              filePath: importEntry.resolvedTo,
              funcName,
              isDefault: false
            });
            registerForMockingAtTheTop(action);
          }
        });
      }
      return !!!declaration;
    }
    return true;
  });
  foundInThisFile.forEach(({ serverActionClientId, funcName }) => {
    insertAtTheTop(node.ast, clientSideServerActionCall(serverActionClientId, funcName));
  });
}
function createServerActionFactory(serverActions) {
  return action => {
    const found = serverActions.find((a) => a.funcName === action.funcName && a.filePath === action.filePath);
    if (found) {
      return found;
    }
    action.serverActionClientId = `$FSA_${getId()}_${action.funcName}`;
    serverActions.push(action);
    return action;
  }
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