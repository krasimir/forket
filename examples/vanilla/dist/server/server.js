import forketServerActionsHandler from "./forketServerActions.js";
import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import path from "path";
import http from "http";
import express from "express";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import multer from "multer";
import Forket from "../../../../forket/index.js";
import App from "./components/App.js";
import serveImage from "./handlers/serve-image.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = 8087;
const app = express();
const fromDataHandler = multer({
  storage: multer.memoryStorage()
});
const server = http.createServer(app);
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/image/:id", serveImage);
Forket().then((forket) => {
  forket.setRenderer(renderToPipeableStream);
  app.use("/@forket", fromDataHandler.any(), forket.forketServerActions(forketServerActionsHandler));
  app.get("/", forket.serveApp({
    serverActionsEndpoint: "/@forket",
    rootElementFactory: (req) => /* @__PURE__ */ React.createElement(App, { request: req })
  }));
});
server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});
