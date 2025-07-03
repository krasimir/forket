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
          let clientBoundary = null;
          let resolvedFiles = null;

          build.onStart(() => {
            // console.log("esbuild-plugin: starting build for type:", options.type);
            clientBoundary = new Map();
            resolvedFiles = new Map();
          });
          build.onEnd(() => {
            // console.log("esbuild-plugin: build finished for type:", options.type);
            clientBoundary = null;
            resolvedFiles = null;
          });
          build.onResolve({ filter: /.*/ }, async (args) => {
            // console.log("esbuild-plugin: resolving file:", args.path);
            const fullPath = noExt(path.resolve(args.resolveDir, args.path));
            if (resolvedFiles.has(fullPath)) {
              resolvedFiles.set(fullPath, resolvedFiles.get(fullPath).concat([args.path]));
            } else {
              resolvedFiles.set(fullPath, [args.path]);
            }
          });
          build.onLoad({ filter: FILTER_REGEXP }, async (args) => {
            console.log("esbuild-plugin: processing file:", args.path, resolvedFiles.size);
            console.log(resolvedFiles);
            if (options.type === "client") {
              if (resolvedFiles.has(noExt(args.path))) {
                // console.log(resolvedFiles.get(noExt(args.path)));
              }
              const fileCode = await fs
                .readFile(args.path, "utf8")
                .catch((err) => printDiagnostics({ file: args.path, err }));
              const { code, meta } = await transform(fileCode, options.type, args.path);
              if (meta.useClient) {
                if (meta.imports && meta.imports.length > 0) {
                  meta.imports.forEach(({ source }) => {
                    clientBoundary.set(source, noExt(args.path));
                  });
                }
              }
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
function noExt(pathString) {
  return pathString.replace(/\.[^/.]+$/, "");
}
