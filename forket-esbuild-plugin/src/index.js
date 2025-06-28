const path = require("path");
const fs = require("fs").promises;
const { inspect } = require("util");

const Forket = require('../../forket/index')

const FILTER_REGEXP = /\.(tsx|jsx)?$/;
const POSSIBLE_TYPES = ["server", "client"];

module.exports = function (options = {}) {
  if (!options.type || !POSSIBLE_TYPES.includes(options.type)) {
    throw new Error(`Forket: Invalid type "${options.type}". Expected one of: ${POSSIBLE_TYPES.join(", ")}`);
  }

  return {
    plugin() {
      return {
        name: "forket",
        setup(build) {
          const { transform } = Forket.init();

          build.onLoad({ filter: FILTER_REGEXP }, async (args) => {
            console.log('esbuild-plugin: processing file:', args.path);
            if (options.type === "server") {
            } else {
              const fileCode = await fs
                .readFile(args.path, "utf8")
                .catch((err) => printDiagnostics({ file: args.path, err }));     
              const { code, meta } = await transform(fileCode, options.type, args.path);         
              return { contents: code };
            }
          });
        }
      };
    }
  };
};

function printDiagnostics(...args) {
  console.log(inspect(args, false, 10, true));
}
