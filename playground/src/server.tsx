import React from "react";
import path from "path";
import { renderToString } from "react-dom/server";
import http from "http";
import express from "express";

import App from './components/App'

const port = 8087;
const app = express();
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.type("text/html");
  res.send(
    `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Playground</title>
</head>
<body>
    <div id="root">
    ${renderToString(<App />)}
    </div>
    <script src="/bundle.js"></script>
</body>
</html>`
  );
});

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});