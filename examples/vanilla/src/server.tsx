import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import path from "path";
import http from "http";
import express from "express";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
// import Forket from "forket";
import Forket from "../../../../forket/index.js";

import App from './components/App.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 8087;
const app = express();
const server = http.createServer(app);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));

Forket().then(forket => {
  // Not necessary if we use
  // | import Forket from "forket"
  // Otherwise Forket uses its own React which causes issues.
  forket.setRenderer(renderToPipeableStream);
  forket.setupForketSA(app);
  forket.setupApp(app, "/", (req) => <App request={req} />);
})

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});