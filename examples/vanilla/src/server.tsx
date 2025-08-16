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
import { pipeline, env } from "@huggingface/transformers";
// import Forket from "forket";
import Forket from "../../../../forket/index.js";

import App from './components/App.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 8087;
const app = express();

const fromDataHandler = multer({ storage: multer.memoryStorage() });
const server = http.createServer(app);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "..", "public")));

Forket().then((forket) => {
  // Not necessary if we use
  // | import Forket from "forket"
  // Otherwise Forket uses its own React which causes issues.
  forket.setRenderer(renderToPipeableStream);
  app.use("/@forket", fromDataHandler.any(), forket.forketServerActions());
  app.get("/", forket.serveApp({
    serverActionsEndpoint: "/@forket",
    rootElementFactory: (req) => <App request={req} />
  }))
});

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});


// ------------------------------------------------
env.allowRemoteModels = true;
env.cacheDir = path.normalize(__dirname + "/../../models"); 

// Working for sentiment analysis
// const pipe = await pipeline("sentiment-analysis", "Xenova/distilbert-base-uncased-finetuned-sst-2-english");
// const [res] = await pipe("I'm a web developer that knows nothing about HTML");
// console.log(res);

// const imgPath = __dirname + "/../../me_speaking.jpg";
// if (fs.existsSync(imgPath)) {
//   const classify = await pipeline("image-classification", "Xenova/vit-base-patch16-224");
//   const result = await classify(imgPath, { topk: 5 });

//   console.log("Predictions:");
//   for (const r of result) {
//     console.log(`${r.label} — ${(r.score * 100).toFixed(2)}%`);
//   }
// }