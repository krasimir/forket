import React from "react";
import fs from 'fs';
import { renderToPipeableStream } from "react-dom/server";
import path from "path";
import http from "http";
import express from "express";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import multer from "multer";
// import Forket from "forket";
import Forket from "../../../../forket/index.js";

import App from './components/App.js'
import serveImage from './handlers/serve-image.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 8087;
const app = express();

const fromDataHandler = multer({ storage: multer.memoryStorage() });
const server = http.createServer(app);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/image/:id", serveImage);

Forket().then((forket) => {
  app.use("/@forket", fromDataHandler.any(), forket.forketServerActions());
  app.get("/", (req, res) => {
    const { pipe, abort } = renderToPipeableStream(<App request={req} />, {
      bootstrapScriptContent: forket.client("/@forket"),
      onShellReady() {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        pipe(res);
      },
      onError(err) {
        console.error(err);
      }
    });
  });
});

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});


// ----------------------------------------------- 

// Working for sentiment analysis
// const pipe = await pipeline("sentiment-analysis", "Xenova/distilbert-base-uncased-finetuned-sst-2-english");
// const [res] = await pipe("I'm a web developer that knows nothing about HTML");
// console.log(res);

