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
          let map = null;

          build.onStart(() => {
            // console.log("esbuild-plugin: starting build for type:", options.type);
            map = new Map();
          });
          build.onEnd(() => {
            // console.log("esbuild-plugin: build finished for type:", options.type);
            map = null;
          });
          build.onResolve({ filter: /.*/ }, async (args) => {
            // console.log("esbuild-plugin: resolving file:", args.path);
          });
          build.onLoad({ filter: FILTER_REGEXP }, async (args) => {
            console.log("esbuild-plugin: processing file:", args.path, map.has(args.path));
            const fileCode = await fs
              .readFile(args.path, "utf8")
              .catch((err) => printDiagnostics({ file: args.path, err }));
            const { code, meta } = await transform(fileCode, options.type, args.path);
            map.set(args.path, { code, meta });
            return { contents: code };
          });
        }
      };
    }
  };
};

function printDiagnostics(...args) {
  console.log(inspect(args, false, 10, true));
}
