const path = require("path");
const fs = require("fs").promises;
const { inspect } = require("util");

const { transform } = require('../../forket/index')

const FILTER_REGEXP = /\.m?(tsx|jsx)?$/;
const POSSIBLE_TYPES = ["server", "client"];

module.exports = function (options = {}) {
  if (!options.type || !POSSIBLE_TYPES.includes(options.type)) {
    throw new Error(`Forket: Invalid type "${options.type}". Expected one of: ${POSSIBLE_TYPES.join(", ")}`);
  }
  const isServer = options.type === "server";

  return {
    plugin() {
      return {
        name: "forket",
        setup(build) {
          build.onLoad({ filter: FILTER_REGEXP }, async (args) => {
            if (isServer) {
            } else {
              const fileCode = await fs
                .readFile(args.path, "utf8")
                .catch((err) => printDiagnostics({ file: args.path, err }));              
              return { contents: await transform(fileCode, options.type, args.path) };
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
