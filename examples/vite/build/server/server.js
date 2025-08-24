import forketServerActionsHandler from "./forketServerActions.js";
import path from "node:path";
import express from "express";
import React from "react";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import Forket from "../../../../forket/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function createServer() {
    const app = express();
    const vite = await createViteServer({
        server: {
            middlewareMode: true
        },
        appType: "custom"
    });
    app.use(vite.middlewares);
    Forket().then(async (forket)=>{
        const foo = await import("./components/App.tsx");
        const { default: App } = await vite.ssrLoadModule("/build/server/components/App.tsx");
        app.use("/@forket", forket.forketServerActions(forketServerActionsHandler));
        app.get("/", forket.serveApp({
            factory: (req)=>React.createElement(App),
            serverActionsEndpoint: "/@forket"
        }));
    });
    app.listen(3000, ()=>{
        console.log("🟢 Dev server running: http://localhost:3000");
    });
}
createServer();
