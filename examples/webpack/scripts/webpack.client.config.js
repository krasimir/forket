import path from "node:path";

/** @type {import('webpack').Configuration} */
const config = {
  name: "client",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",

  target: "web",

  // Source maps like your esbuild config
  devtool: "source-map",

  // If you want an ESM bundle and will load it with <script type="module">,
  // you can enable outputModule. For a classic script, leave this off.
  // experiments: { outputModule: true },

  module: {
    rules: [
      // TS/TSX via Babel (React + TypeScript)
      {
        test: /\.[mc]?tsx?$/,
        exclude: /node_modules/,
        resolve: { fullySpecified: false }, // allow extension-less imports
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                {
                  // Adjust targets to your browser support policy
                  targets: ">0.25%, not dead",
                  modules: false
                }
              ],
              ["@babel/preset-react", { runtime: "automatic", development: process.env.NODE_ENV !== "production" }],
              ["@babel/preset-typescript", { allowDeclareFields: true }]
            ]
          }
        }
      },
      // JS/JSX
      {
        test: /\.[mc]?jsx?$/,
        exclude: /node_modules/,
        resolve: { fullySpecified: false },
        use: {
          loader: "babel-loader",
          options: {
            babelrc: false,
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: ">0.25%, not dead",
                  modules: false
                }
              ],
              ["@babel/preset-react", { runtime: "automatic", development: process.env.NODE_ENV !== "production" }]
            ]
          }
        }
      }
    ]
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json"],
    mainFields: ["browser", "module", "main"],
    fullySpecified: false // fix extension-less imports under ESM rules
  },

  output: {
    path: path.resolve("dist/public"),
    filename: "bundle.js"
    // For ESM output, uncomment:
    // module: true,
    // chunkFormat: "module",
    // library: { type: "module" },
  },

  // Match esbuild's "single bundle" feel
  optimization: {
    minimize: process.env.NODE_ENV === "production", // minify like esbuild.minify: true
    splitChunks: false,
    runtimeChunk: false
  },

  // Avoid perf noise on large bundles
  performance: { hints: false }
};

export default config;