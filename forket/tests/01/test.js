const path = require('path');
const fs = require('fs');

const { getGraphs, toJSON } = require("../../lib/graph.js");
const { setRoles } = require('../../lib/roles.js');

module.exports = async function ({ test }) {
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
          role: "client_file",
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
                            role: "client_component",
                            children: [
                              {
                                "/tests/01/src/components/ProductListItem.tsx": {
                                  role: "client_component",
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
};