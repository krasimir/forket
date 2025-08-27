import path from "path";
import esbuild from "esbuild";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pkg = JSON.parse(readFileSync(path.join(__dirname, "..", "package.json"), "utf8"));
const minify = true;

(async function () {
  await esbuild.build({
    entryPoints: [path.join(__dirname, "..", "lib", "client", "client.js")],
    bundle: true,
    minify,
    outfile: path.join(__dirname, "..", "lib", "client", "client.min.js"),
    platform: "browser",
    sourcemap: false,
    plugins: [],
    define: {
      __VERSION__: JSON.stringify(pkg.version)
    }
  });
  await esbuild.build({
    entryPoints: [path.join(__dirname, "..", "lib", "client", "component-booter.js")],
    minify,
    outfile: path.join(__dirname, "..", "lib", "client", "component-booter.min.js"),
    platform: "browser",
    sourcemap: false,
    plugins: [],
    define: {
      __VERSION__: JSON.stringify(pkg.version)
    }
  });
  await esbuild.build({
    entryPoints: [path.join(__dirname, "..", "lib", "client", "handle-promise.js")],
    minify,
    outfile: path.join(__dirname, "..", "lib", "client", "handle-promise.min.js"),
    platform: "browser",
    sourcemap: false,
    plugins: [],
    define: {
      __VERSION__: JSON.stringify(pkg.version)
    }
  });
})();
