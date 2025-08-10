import React from "react";
import path from "path";
import { renderToPipeableStream } from "react-dom/server";
import http from "http";
import express from "express";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
// import { client, processChunk } from "forket";
import {
  client,
  processChunk,
  serverActionsHandler,
  FORKET_SERVER_ACTIONS_ENDPOINT
} from "../../../../forket/index.js";

import App from './components/App.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 8087;
const app = express();
const server = http.createServer(app);
const bootstrapScriptContent = client();

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));
// app.use(FORKET_SERVER_ACTIONS_ENDPOINT, serverActionsHandler(__dirname));

app.get("/", (req, res) => {
  const { pipe, abort } = renderToPipeableStream(<App request={req}/>, {
    bootstrapScripts: ["/bundle.js"],
    bootstrapScriptContent,
    onShellReady() {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      processChunk(res);
      pipe(res);
    },
    onError(err) {
      console.error(err);
    }
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});