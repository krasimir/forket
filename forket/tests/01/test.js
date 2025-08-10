import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { getGraphs, toJSON } from "../../lib/graph.js";
import { setRoles } from '../../lib/roles.js';
import insertImports from '../../lib/utils/insertImports.js';
import exposeGlobal from '../../lib/ast/exposeGlobal/index.js';
import insertAtTheTop from "../../lib/utils/insertAtTheTop.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function ({ test, toAST, toCode }) {
  const [graph] = await getGraphs(path.join(__dirname, "src"));
  setRoles(graph);
  
  await test("Should properly find the import/require statements", () => {
    return graph.imports.map((i) => i.source).join(",") === "react,react-dom/client,./components/App,./foobar";
  });
  await test("Should build a graph and properly set the roles", () => {
    return (
      JSON.stringify(toJSON(graph)) ===
      JSON.stringify({
        "/tests/01/src/index.ts": {
          role: "server",
          children: [
            {
              "/tests/01/src/components/App.tsx": {
                role: "server",
                children: [
                  {
                    "/tests/01/src/components/Products.tsx": {
                      role: "server",
                      children: [
                        {
                          "/tests/01/src/components/db.ts": {
                            role: "server",
                            children: []
                          }
                        },
                        {
                          "/tests/01/src/components/ProductsList.tsx": {
                            role: "client",
                            children: [
                              {
                                "/tests/01/src/components/ProductListItem.tsx": {
                                  role: "client",
                                  children: []
                                }
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
                ]
              }
            }
          ]
        }
      })
    );
  });
  await test("Should properly insert imports statements", async () => {
    const cases = ['a', 'b', 'c', 'd', 'e', 'f'];
    for(let i=0; i<cases.length; i++) {
      const baseAST = await toAST(path.join(__dirname, "import_cases", cases[i] + '.js'));
      const expected = fs.readFileSync(path.join(__dirname, "import_cases", cases[i] + ".expected.js"), "utf8");
      insertImports(baseAST, "ReactDOMClient", "react-dom/client");
      insertImports(baseAST, "React", "react");
      if (cases[i] === "e" || cases[i] === "f") {
        insertImports(baseAST, "App", "./components/App", false);
      }
      const result = await toCode(baseAST);
      if (expected !== result) {
        console.log(`(${cases[i]}) Expected:\n${expected}`);
        console.log(`Result:\n${result}`);
        return false;
      };
    }
    return true;
  });
  await test("Should properly insert at the top", async () => {
    const cases = ["a", "b", "c", "d"];
    const toImport = {
      type: "VariableDeclaration",
      span: { start: 1, end: 14 },
      ctxt: 0,
      kind: "const",
      declare: false,
      declarations: [
        {
          type: "VariableDeclarator",
          span: { start: 7, end: 13 },
          id: {
            type: "Identifier",
            span: { start: 7, end: 8 },
            ctxt: 2,
            value: "a",
            optional: false,
            typeAnnotation: null
          },
          init: { type: "NumericLiteral", span: { start: 11, end: 13 }, value: 42, raw: "42" },
          definite: false
        }
      ]
    };
    for (let i = 0; i < cases.length; i++) {
      const ast = await toAST(path.join(__dirname, "importAtThetop_cases", cases[i] + ".js"));
      const expected = fs.readFileSync(path.join(__dirname, "importAtThetop_cases", cases[i] + ".expected.js"), "utf8");
      insertAtTheTop(ast, toImport);
      const result = await toCode(ast);
      if (expected !== result) {
        console.log(`(${cases[i]}) Expected:\n${expected}`);
        console.log(`Result:\n${result}`);
        return false;
      }
    }
    return true;
  });
  await test("Should properly expose React libs", async () => {
    const cases = ["a"];
    for (let i = 0; i < cases.length; i++) {
      const baseAST = await toAST(path.join(__dirname, "exposeReact", cases[i] + ".js"));
      const expected = fs.readFileSync(path.join(__dirname, "exposeReact", cases[i] + ".expected.js"), "utf8");
      baseAST.body = baseAST.body
        .concat(exposeGlobal("React", "React"))
        .concat(exposeGlobal("ReactDOMClient", "ReactDOMClient"));
      const result = await toCode(baseAST);
      if (expected !== result) {
        console.log(`(${cases[i]}) Expected:\n${expected}`);
        console.log(`Result:\n${result}`);
        return false;
      }
    }
    return true;
  });
};