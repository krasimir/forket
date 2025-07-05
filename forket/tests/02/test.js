const path = require('path');
const fs = require('fs');

const { processEntryPoint } = require("../../lib/graph");
const { Thanos, MODE } = require("../../lib/thanos");
const { setRoles } = require('../../lib/roles');

module.exports = async function ({ test, xtest, testCase }) {

  const cases = (
    await Promise.all(
      fs.readdirSync(path.join(__dirname, "cases"), { withFileTypes: true }).map(async (entry) => {
        if (!entry.isFile()) {
          return false;
        }
        if (testCase && testCase !== "all") {
          if (!entry.name.startsWith(testCase)) {
            return false;
          }
        }
        const thanos = Thanos();
        const filePath = path.join(__dirname, "cases", entry.name);
        const graph = await processEntryPoint(filePath);
        setRoles(graph);
        const mode = entry.name.includes("_server") ? MODE.SERVER : MODE.CLIENT;
        const newContent = await thanos.snap([graph], filePath, read(filePath), mode);
        return {
          message: `${entry.name} (role: ${graph.role}) (mode: ${mode})`,
          newContent,
          expected: read(path.join(__dirname, "cases", "expected", entry.name))
        };
      })
    )
  ).filter(Boolean);
  
  for(let i=0; i < cases.length; i++) {
    const { message, newContent, expected } = cases[i];
    await test(message, async () => {
      const result = newContent === expected;
      if (!result) {
        console.log("Expected:\n", expected);
        console.log("Got:\n", newContent);
      }
      return expected === newContent;
    });
  }
  
};

function read(file) {
  return fs.readFileSync(file, "utf-8");
}