export const DEFAULT_OPTIONS = {
  sourceDir: undefined,
  buildDir: undefined,
  serverDirName: "server",
  clientDirName: "client",
  forketServerActionsHandler: "forketServerActions.js",
  serverActionsEndpoint: "/@forket",
  clientCopyableFiles: [
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".styl",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".webp",
    ".ico",
    ".avif",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".eot",
    ".mp3",
    ".wav",
    ".ogg",
    ".mp4",
    ".webm",
    ".m4a",
    ".pdf",
    ".zip",
    ".gz",
    ".tar",
    ".bz2",
    ".7z",
    ".wasm"
  ],
  watch: false,
  printGraph: false,
  exposeReactGlobally: true,
  enableLogging: true,
  serverLogsColor: '#999',
  clientLogsColor: '#289c48',
};
export const ROLE = {
  SERVER: "server",
  CLIENT: "client"
};
export const VALID_FILES_TO_PROCESS = [
  ".js", // JavaScript
  ".mjs", // ES Modules
  ".cjs", // CommonJS
  ".ts", // TypeScript
  ".jsx", // React JSX
  ".tsx" // React + TypeScript
];
