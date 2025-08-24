import path from "path";
import getImportPath from "./getImportPath.js";
import traverseNode from "./traverseNode.js";
import insertImports from "./insertImports.js";

export default function faceliftTheServerActionsSetup(node, options, serverEntryPoints) {
  /* Amending the forket.forketServerActions() call so it looks like
    forket.forketServerActions(forketServerActionsHandler);
    */
  return new Promise((done) => {
    let found = false;
    traverseNode(node.ast, {
      MemberExpression(n, stack) {
        if (n?.property?.value === "forketServerActions") {
          serverEntryPoints.push(node);
          if (stack[0].arguments && Array.isArray(stack[0].arguments) && stack[0].arguments.length === 0) {
            stack[0].arguments.push({
              spread: null,
              expression: {
                type: "Identifier",
                span: {
                  start: 722,
                  end: 725
                },
                ctxt: 2,
                value: "forketServerActionsHandler",
                optional: false
              }
            });
            const handlerPath =
              getImportPath(node.file, path.join(options.sourceDir, options.forketServerActionsHandler));
            insertImports(node.ast, "forketServerActionsHandler", handlerPath);
          }
          found = true;
          done(true);
        }
      }
    });
    if (!found) {
      done(false);
    }
  });
}