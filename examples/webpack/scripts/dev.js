import path from "path";
import fs from "fs";
import chokidar from "chokidar";
import { fileURLToPath } from "url";
import webpack from "webpack";
// import Forket from 'forket';
import Forket from '../../../forket/index.js';
import serverConfigBase from "./webpack.server.config.js";
import clientConfigBase from "./webpack.client.config.js";

import command from "./utils/command.js";
import getAllFiles from "./utils/getAllFiles.js";
import copyFolder from './utils/copyFolder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT = process.cwd();
const SRC = path.normalize(path.join(__dirname, "..", "src"));
const BUILD = path.normalize(path.join(__dirname, "..", "build"));
const DIST = path.normalize(path.join(__dirname, "..", "dist"));

let serverProcess;
let restart = false;

const forket = await Forket({
  watch: true,
  printGraph: true,
});

await forket.process();

// Watching for changes in the build directory, transpile, bundle and restart the server
chokidar.watch(`${BUILD}/**/*`, { ignoreInitial: true }).on("all", (event, file) => {
  if (!restart) {
    restart = true;
    if (serverProcess) {
      serverProcess.kill();
    } else {
      run();
    }
  }
});

run();

async function run() {
  await buildServer();
  await buildClient();
  restart = false;
  serverProcess = command(`node ${path.join(DIST, "server", "server.js")}`, ROOT, (code) => {
    serverProcess = null;
    if (code === null && restart) {
      run();
    }
  });
};
async function buildServer() {
  const serverBuildDir = path.join(BUILD, "server");
  const files = getAllFiles(serverBuildDir);

  const entryFiles = files.filter((f) => /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(f));

  const entries = {};
  for (const absFile of entryFiles) {
    const relFromBuild = path.relative(BUILD, absFile);
    const noExt = relFromBuild.replace(/\.(ts|tsx|js|jsx|mjs|cjs)$/, "");
    entries[noExt] = absFile;
  }

  const config = {
    ...serverConfigBase,
    entry: entries,
    output: {
      ...serverConfigBase.output,
      path: DIST,
      filename: "[name].js",
      module: true,
      chunkFormat: "module",
      chunkFilename: "[name].js",
      library: { type: "module" },
      clean: false,
    },
  };

  const compiler = webpack(config);

  await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      compiler.close(() => {});
      if (err) return reject(err);
      if (stats && stats.hasErrors()) {
        return reject(new Error(stats.toString({ all: false, errors: true, colors: true })));
      }
      console.log(`Server files compiled successfully to ${DIST}/server`);
      resolve();
    });
  });
}
async function buildClient() {
  try {
    const config = {
      ...clientConfigBase,
      entry: path.join(BUILD, "client", "client.tsx"),
      output: {
        ...clientConfigBase.output,
        path: path.join(DIST, "public"),
        filename: "bundle.js",
      },
    };

    const compiler = webpack(config);

    const stats = await new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        compiler.close(() => {});
        if (err) return reject(err);
        if (stats && stats.hasErrors()) {
          return reject(
            new Error(stats.toString({ all: false, errors: true, colors: true }))
          );
        }
        resolve(stats);
      });
    });

    const meta = stats.toJson({
      all: false,
      assets: true,
      chunks: true,
      chunkModules: true,
      reasons: true,
      builtAt: true,
      time: true,
      hash: true,
      moduleAssets: true,
    });

    fs.mkdirSync(path.join(DIST, "public"), { recursive: true });
    fs.writeFileSync(
      path.join(DIST, "public", "meta.json"),
      JSON.stringify(meta, null, 2)
    );

    copyFolder(
      path.join(BUILD, "client", "assets"),
      path.join(DIST, "public", "assets")
    );

    console.log(`Client files compiled successfully to ${path.join(DIST, "public")}`);
  } catch (error) {
    console.error(`Error compiling client: ${error.message}`, error);
  }
}