const path = require("path");
const fs = require("fs");
const spawn = require("child_process").spawn;
const chokidar = require("chokidar");
const chalk = require("chalk");
const esbuild = require("esbuild");

const ROOT = process.cwd();
const SRC = path.normalize(path.join(__dirname, "/../", "src"));
const DIST = path.normalize(path.join(__dirname, "/../", "dist"));
const SERVER_ENTRY_POINT = path.join(DIST, "index.js");
let serverProcess;
let restart = false;
let processes = [];

function runServer() {
  const run = async () => {
    console.log(chalk.yellow("Starting server..."));
    await build();
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


async function build() {
  try {
    await esbuild.build({
      entryPoints: [path.join(SRC, "/index.js")],
      bundle: true,
      outfile: SERVER_ENTRY_POINT,
      platform: "node",
      plugins: [
        
      ]
    });
    console.log(chalk.green(`🖥️ server build successfully`));
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
function copyDirectorySync(from, to) {
  if (!fs.existsSync(to)) {
    fs.mkdirSync(to, { recursive: true });
  }
  const files = fs.readdirSync(from);
  files.forEach((file) => {
    const fromPath = path.join(from, file);
    const toPath = path.join(to, file);
    if (fs.statSync(fromPath).isDirectory()) {
      copyDirectorySync(fromPath, toPath);
    } else {
      fs.copyFileSync(fromPath, toPath);
    }
  });
}