import path from "node:path";
import nodeExternals from "webpack-node-externals";

const config = {
  name: "server",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",

  target: "node",
  externalsPresets: { node: true },
  externalsType: "module",
  externals: [
    nodeExternals({
      importType: "module",
      // keep local/relative imports bundled; exclude node_modules
      allowlist: [/^\.\.?\/|^\/|^server\//]
    })
  ],

  devtool: "source-map",

  experiments: {
    outputModule: true // ESM output
  },

  module: {
    rules: [
      // TS/TSX via Babel (fast, handles JSX)
      {
        test: /\.[mc]?tsx?$/,
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
                  targets: { node: "18" }, // adjust to your runtime
                  modules: false
                }
              ],
              ["@babel/preset-react", { runtime: "automatic", development: process.env.NODE_ENV !== "production" }],
              ["@babel/preset-typescript", { allowDeclareFields: true }]
            ]
            // If you rely on TS path aliases, add:
            // plugins: [["babel-plugin-module-resolver", { alias: { "@": "./src" } }]],
          }
        }
      },
      // Plain JS/JSX files
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
                  targets: { node: "18" },
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
    mainFields: ["module", "main"],
    fullySpecified: false
  },

  output: {
    path: path.resolve("dist"),
    filename: "[name].js",
    module: true,
    chunkFormat: "module",
    library: { type: "module" },
    clean: false
  },

  optimization: {
    minimize: false,
    splitChunks: false,
    runtimeChunk: false
  }
};

export default config;