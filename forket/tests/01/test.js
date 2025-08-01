const path = require('path');
const fs = require('fs');

const { getGraphs, toJSON } = require("../../lib/graph.js");
const { setRoles } = require('../../lib/roles.js');
const insertImports = require('../../lib/utils/insertImports.js');
const exposeGlobal = require('../../lib/ast/exposeGlobal');

module.exports = async function ({ test, toAST, toCode }) {
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
    const cases = ['a', 'b', 'c', 'd'];
    for(let i=0; i<cases.length; i++) {
      const baseAST = await toAST(path.join(__dirname, "import_cases", cases[i] + '.js'));
      const expected = fs.readFileSync(path.join(__dirname, "import_cases", cases[i] + ".expected.js"), "utf8");
      insertImports(baseAST, "ReactDOMClient", "react-dom/client");
      insertImports(baseAST, "React", "react");
      const result = await toCode(baseAST);
      if (expected !== result) {
        console.log(`(${cases[i]}) Expected:\n${expected}`);
        console.log(`Result:\n${result}`);
        return false;
      };
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