import path from "path";
import esbuild from "esbuild";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));

(async function () {
  await esbuild.build({
    entryPoints: [path.join(__dirname, "..", "lib", "client", "index.js")],
    bundle: true,
    minify: true,
    outfile: path.join(__dirname, "..", "lib", "client", "client.min.js"),
    platform: "browser",
    sourcemap: false,
    plugins: [],
    define: {
      __VERSION__: JSON.stringify(pkg.version)
    }
  });
})();
