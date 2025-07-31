import React from "react";
import path from "path";
import { renderToPipeableStream } from "react-dom/server";
import http from "http";
import express from "express";

// This should be really
// import { client, processChunk } from "forket";
import { client, processChunk } from "../../../../forket";

import productsHandler from './api/products'

import App from './components/App'

const port = 8087;
// const TIMEOUT = 10000;
const TIMEOUT = 500;
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "..", "..", "public")));

app.get("/api/products", productsHandler(TIMEOUT));
app.get("/", (req, res) => {
  const { pipe, abort } = renderToPipeableStream(<App />, {
    bootstrapScripts: ["/bundle.js"],
    // bootstrapScripts: [],
    bootstrapScriptContent: client(),
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