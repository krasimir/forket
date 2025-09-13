import forketServerActionsHandler from "./forketServerActions.js";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import path from "path";
import http from "http";
import express from "express";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import Forket from "forket";
import App from "./components/App";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 8087;
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json());
app.use(express.static(path.resolve(path.join(__dirname, "..", "..", "dist", "public"))));
Forket().then((forket)=>{
    app.use("/@forket", forket.forketServerActions(forketServerActionsHandler));
    const handler = forket.serveApp({
        factory: (req)=><App request={req}/>
    });
    app.get("/examples/:example", handler);
    app.get("/", handler);
});
server.listen(port, ()=>{
    console.log(`App listening on port ${port}.`);
});
