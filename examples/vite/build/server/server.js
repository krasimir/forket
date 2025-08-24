import fs from "fs";
import path from "node:path";
import express from "express";
import React from "react";
import { createServer as createViteServer } from "vite";
import { fileURLToPath } from "url";
import Forket from "../../../../forket/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST = path.join(__dirname, "..", "..", "dist");
const manifest = JSON.parse(fs.readFileSync(path.join(DIST, ".vite", "manifest.json"), "utf8"));
const clientBundleFile = `/${manifest["build/client/client.tsx"].file}`;
async function createServer() {
    const app = express();
    app.use(express.static(DIST, {
        index: false,
        maxAge: "1y",
        immutable: true
    }));
    const vite = await createViteServer({
        server: {
            middlewareMode: true
        },
        appType: "custom"
    });
    app.use(vite.middlewares);
    Forket().then(async (forket)=>{
        const { default: App } = await vite.ssrLoadModule("/build/server/main.tsx");
        const { default: forketServerActions } = await vite.ssrLoadModule("/build/server/forketServerActions.js");
        app.use("/@forket", forket.forketServerActions(forketServerActions));
        app.get("/", forket.serveApp({
            factory: (req)=>React.createElement(App, {
                    clientBundleFile
                }),
            serverActionsEndpoint: "/@forket"
        }));
    });
    app.listen(3000, ()=>{
        console.log("\n🟢 Dev server running: http://localhost:3000");
    });
}
createServer();
