import fs from 'fs';
import path from 'path';
import { fileURLToPath } from "url";
import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import chalk from "chalk";

import { requestContext } from "./requestContext.js";
import getId from '../utils/getId.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const booter = fs.readFileSync(path.join(__dirname, "..", "client", "component-booter.min.js")).toString("utf8");
const handlePromise = fs.readFileSync(path.join(__dirname, "..", "client", "handle-promise.min.js")).toString("utf8");
let renderer = renderToPipeableStream;
let RQ = requestContext;

function getGlobals(options) {
  let str = [];
  str.push(`$F_sae = ${JSON.stringify(options?.serverActionsEndpoint)};`);
  str.push(booter);
  str.push(handlePromise);
  str.push(
    options?.enableLogging
      ? `function $F_logs(m,...r){console.log("%c"+m,"color:${options.serverLogsColor};",...r);};`
      : `$F_log=function(){};`
  );
  str.push(
    options?.enableLogging
      ? `function $F_logc(m,...r){console.log("%c"+m,"color:${options.clientLogsColor};",...r);};`
      : `$F_log=function(){};`
  );
  return str.join('');
}

export function serveApp(options) {
  if (!options) {
    throw new Error(
      `‎𐂐 Forket: serveApp requires options object with "factory" and "serverActionsEndpoint" properties.`
    );
  }
  if (typeof options.factory !== "function") {
    throw new Error(`‎𐂐 Forket: serveApp requires "factory" to be a function. Received ${typeof options.factory}`);
  }
  const { factory } = options;

  return (req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");

    const { addTasks, areTasksDone, addTaskListener } = taskManager(res);
    const sendToClient = clientSender(res);

    RQ.run({ getId, addTasks }, () => {
      const reactStream = new PassThrough();
      let reactEnded = false;
      let ended = false;

      reactStream.pipe(res, { end: false });
      reactStream.on("end", () => {
        reactEnded = true;
        sendToClient(`
          $F_logs("‎𐂐 [server] React streaming done.");
        `);
        maybeEnd();
      });
      addTaskListener(maybeEnd);

      sendToClient(getGlobals(options));

      function maybeEnd() {
        if (reactEnded && areTasksDone() && !res.writableEnded && !ended) {
          ended = true;
          sendToClient(`
            $F_logs("‎𐂐 [server] HTTP streaming done.");
          `);
          res.end();
        }
      }
      function onError(err) {
        console.error(chalk.red(`‎𐂐 Error during rendering: ${err.message}`));
        if (!reactEnded) {
          res.statusCode = 500;
          res.end(`Error during rendering: ${err.message}`);
        }
      }

      const { pipe, abort } = renderer(factory(req), {
        onShellReady() {
          res.statusCode = 200;
          pipe(reactStream);
        },
        onAllReady() {},
        onShellError: onError,
        onError
      });

      res.on("close", () => {
        try {
          abort();
        } catch {}
        try {
          reactStream.end();
        } catch {}
      });
    });
  };
}

function taskManager(res) {
  const tasks = new Map();
  const sendToClient = clientSender(res);
  let notify = () => {};

  function handlePromise(status, id, value, boundaryID) {
    sendToClient(`$F_handlePromise("${id}", "${status}", ${JSON.stringify(value)}, "${boundaryID}");`);    
    tasks.delete(id);
    notify();
  }
  function addTasks(id, promise, boundaryID) {
    tasks.set(id, promise);
    promise
      .then((value) => {
        handlePromise('resolved', id, value, boundaryID);
      })
      .catch((err) => {
        handlePromise('rejected', id, err.message, boundaryID);
      });
  };

  return {
    addTasks,
    areTasksDone: () => tasks.size === 0,
    addTaskListener: (cb) => {
      notify = cb;
      res.on("close", () => {
        notify = () => {};
      });
    }
  };
}
export function setRenderer(r) {
  if (typeof r !== "function") {
    throw new Error(`‎𐂐 Forket: renderer must be a function. Received ${typeof r}`);
  }
  renderer = r;
}
export function setRequestContext(r) {
  RQ = r;
}

function clientSender(res) {
  return (code) => {
    res.write(`<script>${code}</script>`);
  }
}
