import child_process from "child_process";

const spawn = child_process.spawn;

export default function command(cmd, cwd, onExit = (c) => {}) {
  const proc = spawn(cmd, {
    shell: true,
    cwd,
    stdio: "inherit"
  });
  proc.on("close", (code) => {
    console.warn(`Process exited with code ${code}`);
    onExit(code);
  });
  // proc.on("exit", (code) => onExit(code));
  proc.on("error", (error) => {
    console.error(`"${cmd}" errored with error = ${error.toString()}`);
  });
  return proc;
}
