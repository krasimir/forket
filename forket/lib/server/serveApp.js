import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import chalk from "chalk";

import { requestContext } from "./requestContext.js";
import getId from '../utils/getId.js';
import serveClient from './serveClient.js';

let renderer = renderToPipeableStream;
let RQ = requestContext;

export function setRenderer(r) {
  if (typeof r !== "function") {
    throw new Error(`‎𐂐 Forket: renderer must be a function. Received ${typeof r}`);
  }
  renderer = r;
}
export function setRequestContext(r) {
  RQ = r;
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
  if (typeof options.serverActionsEndpoint !== "string") {
    throw new Error(
      `‎𐂐 Forket: serveApp requires "serverActionsEndpoint" to be a string. Received ${typeof options.serverActionsEndpoint}`
    );
  }
  const { factory, serverActionsEndpoint } = options;

  return (req, res) => {

    const { addTasks, areTasksDone, addTaskListener } = taskManager(res);

    RQ.run({ getId, addTasks }, () => {
      const reactStream = new PassThrough();
      let reactEnded = false;
      let ended = false;

      reactStream.pipe(res, { end: false });
      reactStream.on("end", () => {
        reactEnded = true;
        res.write(`<script>
          if (typeof window.FSSR_done !== 'undefined') {
            window.FSSR_done();
          }
          $me = document.currentScript;
					if ($me) { $me.remove(); }
        </script>`);
        maybeEnd();
      });
      addTaskListener(maybeEnd);

      function maybeEnd() {
        if (reactEnded && areTasksDone() && !res.writableEnded && !ended) {
          ended = true;
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
        bootstrapScriptContent: serveClient(serverActionsEndpoint),
        onShellReady() {
          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html; charset=utf-8");
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
  let notify = () => {};

  function handlePromise(status, id, value, boundaryID) {
    res.write(`<script>
      if (typeof window.$FLP_ === 'undefined') {
        window.$FLP_ = {};
      }
      if (typeof window.$FLP_['${id}'] === 'undefined') {
        window.$FLP_['${id}'] = {
          value: ${JSON.stringify(value)},
          status: "${status}",
          boundaryID: "${boundaryID}",
        };
      } else {
        window.$FLP_['${id}'].status = "${status}";
        window.$FLP_['${id}'].value = ${JSON.stringify(value)};
        window.$FLP_['${id}'].boundaryID = "${boundaryID}";
      }
      if (typeof window.FLP_process === 'function') {
        window.FLP_process();
      }
      $me = document.currentScript;
      if ($me) { $me.remove(); }
    </script>`);
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
