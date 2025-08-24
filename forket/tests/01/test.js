import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { getGraphs, toJSON } from "../../lib/graph.js";
import { setRoles } from '../../lib/roles.js';
import insertImports from '../../lib/utils/insertImports.js';
import exposeGlobal from '../../lib/ast/exposeGlobal/index.js';
import clientBoundaryWrapper from "../../lib/ast/clientBoundaryWrapper/index.js";
import insertAtTheTop from "../../lib/utils/insertAtTheTop.js";
import traverseNode from "../../lib/utils/traverseNode.js";
import {resetId} from "../../lib/utils/getId.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function ({ test, xtest, toAST, toCode }) {
  const [graph] = await getGraphs(path.join(__dirname, "src"));
  setRoles(graph);
  
  await test("Should parse an AST", async () => {
    const cases = ["a"];
    for (let i = 0; i < cases.length; i++) {
      resetId();
      const baseAST = await toAST(path.join(__dirname, "traverseNode", cases[i] + ".js"));
      const expected = fs.readFileSync(path.join(__dirname, "traverseNode", cases[i] + ".expected.js"), "utf8");
      fs.writeFileSync(path.join(__dirname, "traverseNode", cases[i] + ".ast.json"), JSON.stringify(baseAST, null, 2));
      traverseNode(baseAST, {
        MemberExpression(n) {
          if (n?.property?.value === "forketServerActions") {
            n.property.value = "HoHoHo";
          }
        }
      });
      const result = await toCode(baseAST);
      if (expected !== result) {
        console.log(`(${cases[i]}) Expected:\n${expected}`);
        console.log(`Result:\n${result}`);
        return false;
      }
    }
    return true;
  });
  await test("Should create a client wrapper", async () => {
    const expected = fs.readFileSync(path.join(__dirname, "clientBoundaryWrapper", "expected.js"), "utf8");
    const ast = {
      "type": "Module",
      "span": {
        "start": 1,
        "end": 1245
      },
      "body": [
        clientBoundaryWrapper("FORKETID111", "LoginForm")
      ]
    };
    const transformed = await toCode(ast);
    fs.writeFileSync(path.join(__dirname, "clientBoundaryWrapper", "ast.json"), JSON.stringify(ast, null, 2));
    fs.writeFileSync(path.join(__dirname, "clientBoundaryWrapper", "transformed.js"), transformed);
    return expected === transformed;
  });
  await test("Should properly find the import/require statements", () => {
    const actualSource = graph.imports.map((i) => i.source).join(",");
    const expectedSource = "react,react-dom/client,./components/App,./foobar,./A/B,./C/D,./E/F";
    const actualWhat = graph.imports.map((i) => i.what).join(",");
    const expectedWhat = "React,hydrateRoot,App,foobar,foo,bar,cat,dog";
    if (actualSource === expectedSource) {
      if (actualWhat === expectedWhat) {
        return true;
      } else {
        console.log(`Expected what: ${expectedWhat}`);
        console.log(`Actual what  : ${actualWhat}`);
        return false;
      }
    } else {
      console.log(`Expected: ${expectedSource}`);
      console.log(`Actual  : ${actualSource}`);
      return false;
    }
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
    let cases = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    // cases = ['i']
    for(let i=0; i<cases.length; i++) {
      const baseAST = await toAST(path.join(__dirname, "import_cases", cases[i] + '.js'));
      const expected = fs.readFileSync(path.join(__dirname, "import_cases", cases[i] + ".expected.js"), "utf8");
      insertImports(baseAST, "ReactDOMClient", "react-dom/client");
      insertImports(baseAST, "React", "react");
      if (cases[i] === "e" || cases[i] === "f" || cases[i] === "g" || cases[i] === "h") {
        insertImports(baseAST, "App", "./components/App", false);
      } else if (cases[i] === 'i') {
        insertImports(baseAST, "App", "./components/App");
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