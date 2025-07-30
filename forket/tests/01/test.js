const path = require('path');
const fs = require('fs');

const { getGraphs, toJSON } = require("../../lib/graph.js");
const { setRoles } = require('../../lib/roles.js');
const insertImports = require('../../lib/utils/insertImports.js');
const defineModuleSystem=require('../../lib/utils/defineModuleSystem.js');
const getReactInScopeCommonJS = require("../../lib/ast/reactInScopeCommonJS");
const getReactInScopeESM = require("../../lib/ast/reactInScopeESM");

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
  await test("Should properly insert imports #1", async () => {
    const baseAST = await toAST(path.join(__dirname, "import_cases", "a.js"));
    const expected = fs.readFileSync(path.join(__dirname, "import_cases", "a.expected.js"), "utf8");
    if (defineModuleSystem(baseAST) === "commonjs") {
      insertImports(baseAST, getReactInScopeCommonJS());
    } else {
      insertImports(baseAST, getReactInScopeESM());
    }
    const result = await toCode(baseAST);
    console.log(result);
  });
};