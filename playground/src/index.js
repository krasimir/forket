import http from "http";
import express from "express";

const port = 8087;
const app = express();
const server = http.createServer(app);

app.get("/", (req, res) => {
  res.type("text/html");
  res.send(`Hey`);
});

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});