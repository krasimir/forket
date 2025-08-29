import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import path from "path";
import http from "http";
import express from "express";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import Forket from "forket";
// import Forket from "../../../../forket/index.js";
import { requestContext } from "forket/lib/server/requestContext.js";

import App from './components/App.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 8087;
const app = express();

const server = http.createServer(app);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));

Forket().then((forket) => {
  // <start> This is only needed here because we are using relative path to Forket.
  // forket.setRenderer(renderToPipeableStream);
  // forket.setRequestContext(requestContext);
  // </end> This is only needed here because we are using relative path to Forket.
  app.use("/@forket", forket.forketServerActions());
  const handler = forket.serveApp({
    factory: (req) => <App request={req} />
  });
  app.get("/examples/:example", handler);
  app.get("/", handler);
});

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});

