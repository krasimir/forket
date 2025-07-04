const fs = require('fs');
const path = require('path');
const swc = require("@swc/core");
const get = require("lodash/get");
const { CachedInputFileSystem, ResolverFactory } = require("enhanced-resolve");

const traverseNode = require("./utils/traverseNode.js");

const VALID_ENTRY_POINTS = [".js", ".jsx", ".ts", ".tsx"];

async function processFile(file) {
  const code = fs.readFileSync(file, 'utf8');
  const { transform, parse, print } = swc;
  const ast = await parse(code, {
    syntax: "typescript", // or 'ecmascript'
    tsx: true,
    decorators: false
  });

  const { imports } = processAST(ast);

  function processAST(ast, type) {
    const imports = [];

    function processImports(node) {
      imports.push({ source: get(node, "source.value") });
    }
    function processCallExpression(node) {
      if (get(node, 'callee.value') === "require") {
        imports.push({ source: get(node, "arguments[0].expression.value") });
      }
    }

    traverseNode(ast, {
      ImportDeclaration: processImports,
      CallExpression: processCallExpression
    });

    return {
      imports
    };
  }

  return {
    file,
    code,
    ast,
    imports,
    children: []
  };
}
async function resolveImports(host, request) {
  const fileSystem = new CachedInputFileSystem(fs, 4000);
  const resolver = ResolverFactory.createResolver({
    conditionNames: ["import", "require", "default"],
    useSyncFileSystemCalls: false,
    fileSystem,
    extensions: VALID_ENTRY_POINTS
  });

  return new Promise((resolve, reject) => {
    resolver.resolve({}, path.dirname(host), request, {}, (err, result) => {
      if (err) {
        return reject(err);
      }
      if (!result) {
        return reject(new Error(`Module "${request}" is not found in "${host}"`));
      }
      if (result.match(/node_modules/)) {
        return reject(new Error(`Module is somewhere in node_modules`));
      }
      resolve(result);
    });
  });
}

module.exports = async function (dir) {
  // finding the entry points for processing
  const entryPoints = fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => {
      return entry.isFile() && VALID_ENTRY_POINTS.includes('.' + (entry.name.split(".").pop() || ""));
    })
    .map((entry) => path.join(dir, entry.name));

  // resolving the imports and building the graph
  const PROCESSED = new Map();
  const RESOLVED = new Map();
  await Promise.all(entryPoints.map(async (entryPoint) => {
    async function process(filePath) {
      let file = PROCESSED.get(filePath);
      if (!file) {
        file = await processFile(filePath);
        PROCESSED.set(filePath, file);
      }
      console.log(`---> ${filePath}`);
      return Promise.all(file.imports.map(async (imp) => {
        const key = `${path.dirname(filePath)}:${imp.source}`;
        try {
          let resolved = RESOLVED.get(key);
          if (typeof resolved === 'undefined') {
            resolved = await resolveImports(filePath, imp.source);
            RESOLVED.set(key, resolved);
          } else if (resolved === null) {
            return;
          }
          console.log(`:${imp.source}`);
          console.log(`it is in ${resolved}`);
          file.children.push(await process(resolved));
        } catch(err) {
          RESOLVED.set(key, null);
          console.error(`Ignoring "${imp.source}"`);
        }
      }));
    }
    return process(entryPoint);
  }));
}

/*
const { CachedInputFileSystem, ResolverFactory } = require("enhanced-resolve");
const Fs = require("fs");
const Path = require('path');
const Module = require('module');

async function buildGraph(entrypoint, options) {
  const fileSystem = new CachedInputFileSystem(options.fs ?? Fs, 4000);
  const resolver = ResolverFactory.createResolver({
    pnpApi: null,
    conditionNames: options.conditionNames ?? ['import', 'require', 'default'],
    useSyncFileSystemCalls: false,
    fileSystem,
    extensions: options.resolveExtensions ?? [
      '.js',
      '.jsx',
      '.json',
      '.ts',
      '.tsx',
    ],
  });
  const rootDir = options.rootDir ?? process.cwd();
  
  const ignoreEdge = new Set(Module.builtinModules);

  
  const unresolvedEdgeQueue = [];  

  
  const unparsedFileQueue = [];
  
  const seenFiles = new Set();

  const edges = new Set();
  const files = new Map();

  const readFile = (fileName) => {
    return new Promise((resolve, reject) => {
      return fileSystem.readFile(
        fileName,
        { encoding: 'utf8' },
        (err, result) => {
          if (err) {
            return reject(err);
          }

          return resolve(result);
        }
      );
    });
  };

  const resolve = (spec,fromId) => {
    const ctx = {};

    return new Promise((resolve, reject) =>
      resolver.resolve({}, fromId, spec, ctx, (err, resolved) => {
        if (err) {
          return reject(err);
        }

        return resolve({ ctx, resolved });
      })
    );
  };

  // We can't let this throw because nothing will register a catch handler.
  const parseFile = async (fileName) => {
    try {
      const sourceContent = await readFile(fileName);
      const loader = loaderForPath(fileName);

      if (!loader) {
        // We can't figure out a loader so let's just treat it as a leaf node
        files.set(fileName, { content: sourceContent, id: fileName });
        return;
      }

      const buildResult = await esbuild.build({
        bundle: true,
        define: {
          // TODO: Dynamic env vars
          'proess.env.NODE_ENV': JSON.stringify('development'),
        },
        format: 'esm',
        metafile: true,
        platform: 'neutral',
        plugins: [
          {
            name: 'capture-edges',
            setup: (build) => {
              build.onResolve({ filter:  }, (args) => {
                if (!ignoreEdge.has(args.path)) {
                  unresolvedEdgeQueue.push({
                    fromId: fileName,
                    fromContext: args.resolveDir,
                    kind: args.kind,
                    toSpec: args.path,
                  });
                }

                // Mark everythign as external. We're only using esbuild to transform
                // on a file-by-file basis and capture dependencies.
                return { external: true };
              });
            },
          },
        ],
        // sourcemap: true,
        // sourcesContent: true,
        stdin: {
          contents: sourceContent,
          resolveDir: Path.dirname(fileName),
          loader: loaderForPath(fileName),
          sourcefile: fileName,
        },
        // TODO: Dynamic target
        target: 'node14',
        treeShaking: true,
        write: false,
      });

      const content = buildResult.outputFiles[0].text;

      files.set(fileName, { content, id: fileName });
    } catch (err) {
      console.error('parseFile error', err);
    }
  };

  // We can't let this throw because nothing will register a catch handler.
  const resolveEdge = async (edge) => {
    try {
      const { resolved } = await resolve(edge.toSpec, edge.fromContext);

      // TODO: We need special handling for `false` files and proper error handling
      // for files that failed to resolve.
      invariant(resolved, 'All files must successfully resolve (for now)');

      // Record the resolved edge.
      // TODO: Make sure we don't record the same logical edge twice.
      edges.add({
        fromId: edge.fromId,
        toId: resolved,
        kind: edge.kind,
      });
      unparsedFileQueue.push(resolved);
    } catch (err) {
      console.error('resolveEdge error', err);
    }
  };

  const promises = new Set<Promise<unknown>>();
  const track = (op: Promise<unknown>) => {
    promises.add(op);
    op.finally(() => promises.delete(op));
  };

  for (const entrypointSpec of entrypoint) {
    unresolvedEdgeQueue.push({
      fromId: '<root>',
      fromContext: rootDir,
      toSpec: entrypointSpec,
      kind: 'entry-point',
    });
  }

  while (unparsedFileQueue.length || unresolvedEdgeQueue.length) {
    while (unparsedFileQueue.length) {
      const unparsedFile = unparsedFileQueue.shift()!;

      if (!seenFiles.has(unparsedFile)) {
        seenFiles.add(unparsedFile);

        track(parseFile(unparsedFile));
      }
    }

    while (unresolvedEdgeQueue.length) {
      const unresolvedEdge = unresolvedEdgeQueue.shift()!;

      track(resolveEdge(unresolvedEdge));
    }

    while (promises.size) {
      await Promise.race(promises);
    }
  }

  return { edges, files };
}

function loaderForPath(fileName: string): Loader | undefined {
  const ext = Path.extname(fileName).slice(1);
  switch (ext) {
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'js';
    case 'jsx':
    case 'ts':
    case 'tsx':
    case 'json':
    case 'css':
      return ext;
  }
}

module.exports = async function(dir) {
  const graph = await buildGraph(["./src/dev"], {});
  console.timeEnd("buildGraph");

  console.log("Found %d modules with %d edges", graph.files.size, graph.edges.size);
}*/