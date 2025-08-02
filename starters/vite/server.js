import path from "path";
import fs from "fs";
import React from "react";
import express from "express";
import { createServer as createViteServer } from "vite";
import { renderToPipeableStream } from "react-dom/server";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createServer() {
  const app = express();

  // 1. Create Vite dev server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
  });

  // 2. Use Vite's connect instance as middleware
  app.use(vite.middlewares);

  // 3. Your own SSR route
  app.get("*all", async (req, res) => {
    try {
      const templatePath = path.join(__dirname, "build", "server", "index.html");
      let template = fs.readFileSync(templatePath, "utf-8");
      const { default: App } = await vite.ssrLoadModule("/build/server/App.tsx");
      const html = await vite.transformIndexHtml(req.url, template);
      const [htmlStart, htmlEnd] = html.split("<!--ssr-outlet-->");

      const stream = renderToPipeableStream(React.createElement(App), {
        onShellReady() {
          res.setHeader("Content-Type", "text/html");
          res.write(htmlStart);
          stream.pipe(res);
        },
        onError(err) {
          console.error("render error", err);
          res.status(500).end("Internal error");
        },
        onAllReady() {
          res.write(htmlEnd);
          res.end();
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).end(e.message);
    }
  });

  app.listen(3000, () => {
    console.log("🟢 Dev server running: http://localhost:3000");
  });
}

createServer();
