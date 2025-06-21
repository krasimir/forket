import React from "react";
import path from "path";
import { renderToPipeableStream } from "react-dom/server";
import http from "http";
import express from "express";

import productsHandler from './api/products'

import App from './components/App'

const port = 8087;
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/products", productsHandler);
app.get("/", (req, res) => {
  const stream = renderToPipeableStream(<App />, {
    bootstrapScripts: ["/bundle.js"],
    onShellReady() {
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      stream.pipe(res);
    },
    onError(err) {
      console.error(err);
    }
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});