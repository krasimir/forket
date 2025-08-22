import React from "react";
import http from "http";
import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import multer from "multer";
import Forket from "forket";

import App from "./components/App.js";

const port = 8087;
const app = express();

const fromDataHandler = multer({ storage: multer.memoryStorage() });
const server = http.createServer(app);

app.use(cookieParser());
app.use(bodyParser.json());

Forket().then((forket) => {
  app.use("/@forket", fromDataHandler.any(), forket.forketServerActions());
  app.get(
    "/",
    forket.serveApp({
      factory: (req) => <App request={req} />,
      serverActionsEndpoint: "/@forket"
    })
  );
});

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});
