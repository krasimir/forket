import forketServerActionsHandler from "./forketServerActions.js";
import React from "react";
import path from "path";
import http from "http";
import express from "express";
import { fileURLToPath } from "url";
import Forket from "forket";
import App from './components/App.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 8087;
const app = express();
const server = http.createServer(app);
app.use(express.static(path.join(__dirname, "..", "public")));
Forket().then((forket)=>{
    app.use("/@forket", forket.forketServerActions(forketServerActionsHandler));
    const handler = forket.serveApp({
        factory: (req)=><App request={req}/>,
        serverActionsEndpoint: "/@forket"
    });
    app.get("/examples/:example", handler);
    app.get("/", handler);
});
server.listen(port, ()=>{
    console.log(`App listening on port ${port}.`);
});
