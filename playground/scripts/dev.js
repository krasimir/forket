const path = require("path");
const fs = require("fs");
const spawn = require("child_process").spawn;
const chokidar = require("chokidar");
const chalk = require("chalk");
const esbuild = require("esbuild");
const Forket = require(path.join(__dirname, '..', '..', 'forket-esbuild-plugin', 'src', 'index.js'));

const ROOT = process.cwd();
const SRC = path.normalize(path.join(__dirname, "..", "src"));
const DIST = path.normalize(path.join(__dirname, "..", "dist"));
const SERVER_ENTRY_POINT = path.join(DIST, "server/server.js");
const CLIENT_BUNDLE = path.join(DIST, "public", "bundle.js");
let serverProcess;
let restart = false;
let processes = [];

function runServer() {
  const run = async () => {
    console.log(chalk.yellow("Starting server..."));
    await buildServer();
    await buildClient();
    const commandToExecute = `node ${SERVER_ENTRY_POINT}`;
    serverProcess = command(commandToExecute, ROOT, (code) => {
      serverProcess = null;
      if (code === null && restart) {
        run();
      }
    });
  };
  run();
  chokidar.watch(`${SRC}/**/*`, { ignoreInitial: true }).on("all", () => {
    restart = true;
    if (serverProcess) {
      serverProcess.kill();
    } else {
      run();
    }
  });
}

runServer();


async function buildServer() {
  const forket = Forket();
  const files = getAllFiles(SRC);
  try {
    await Promise.all(files.map(async (file) => {
      const outfile = path.join(path.join(DIST, 'server'), path.relative(SRC, file).replace(/\.(ts|tsx|js|tsx)$/, ".js"));
      await esbuild.build({
        entryPoints: [file],
        bundle: true,
        outfile,
        platform: "node",
        plugins: [forket.plugin()]
      });
    }));
    console.log(chalk.green(`🖥️ server build successfully`));
  } catch (error) {
    console.error(chalk.red(`Error compiling server: ${error.message}`));
  }
}
async function buildClient() {
  const forket = Forket();
  try {
    await esbuild.build({
      entryPoints: [path.join(SRC, "/client.js")],
      bundle: true,
      outfile: CLIENT_BUNDLE,
      platform: "browser",
      sourcemap: true,
      plugins: [forket.plugin()]
    });
    console.log(chalk.green(`🖥️ client build successfully`));
  } catch (error) {
    console.error(chalk.red(`Error compiling server: ${error.message}`));
  }
}
function command(cmd, cwd, onExit = (c) => {}) {
  const proc = spawn(cmd, {
    shell: true,
    cwd,
    stdio: "inherit"
  });
  proc.on("close", (code) => {
    console.warn(`Process exited with code ${code}`);
  });
  proc.on("exit", (code) => onExit(code));
  proc.on("error", (error) => {
    console.error(
      `"${cmd}" errored with error = ${error.toString()}`
    );
  });
  processes.push(proc);
  return proc;
};
function getAllFiles(dir) {
  const result = [];
  function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else {
        result.push(fullPath);
      }
    }
  }
  walk(dir);
  return result;
}