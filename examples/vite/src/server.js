import path from "node:path";
import express from "express";
import React from "react";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
// import Forket from "forket";
import Forket from "../../../../forket/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();

  // 1. Create Vite dev server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom"
  });

  // 2. Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  // 3. Your own SSR route
  Forket().then(async (forket) => {

    const foo = await import("./components/App.tsx");
    const { default: App } = await vite.ssrLoadModule("/build/server/components/App.tsx");
    app.use("/@forket", forket.forketServerActions());
    app.get("/", forket.serveApp({
      factory: (req) => React.createElement(App),
      serverActionsEndpoint: "/@forket"
    }));
  });  

  app.listen(3000, () => {
    console.log("🟢 Dev server running: http://localhost:3000");
  });
}

createServer();
