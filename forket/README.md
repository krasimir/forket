# 𐂐 forket

## Mental model

The idea of this library is to work before your usual pipeline kicks in. Forket does static analyses of your code and produces client and server versions. After that you have to hook your current building tools to process the files - compile/transpile, create client bundles and running HTTP server. There is a small example [here](../examples//just-cli/) that demonstrates that split (check out the [src](../examples/just-cli/src/) directory and result [build](../examples/just-cli/build/)).

<p align="center">
  <img width="500" src="../assets/project_whitebg.png">
</p>

## Installation

```
> npm install forket
```

## Usage

You need Forket running in two modes - at build time and when your app is running.

### At build time

You either use the CLI version or incorporate the library in your scripts. For example

```
> npx forket
```

will run Forket and as soon as you have `forket.config.js` nearby you'll get the splitting working. Check [this example](../examples//just-cli/). Install the dependencies and run the command there to replicate.

Or if you have some sort of build scripting (recommended):

```js
import Forket from 'forket';

const forket = await Forket();
await forket.process();
```

This is the first part of the job. After that your code is split into `server` and `client` version.

### At run time

There is a bit of a glue code that is needed to make both server and client work together.

#### Instrument your HTTP server

Let's say that you have some sort of HTTP server library like [express](https://expressjs.com/).

```js
import express from "express";
import Forket from "forket";

const port = 8087;
const app = express();
const server = http.createServer(app);

Forket().then((forket) => {
  app.use("/@forket", forket.forketServerActions());
  app.get("/", forket.serveApp({
    factory: (req) => <App request={req} />
  }));
});

server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});
```

We are defining an endpoint for our [server functions](https://react.dev/reference/rsc/server-functions) and making sure that Forket is serving our main page component. Internally the library is using [renderToPipeableStream](https://react.dev/reference/react-dom/server/renderToPipeableStream) to stream the React components. Notice that the path `/@forket` is configurable if you want to have something different.

#### At least one client entry point

Forket requires a client entry point because it is patching it with globally available React components. That's why you need at least one file in your root directory that has `"use client"`. Usually that's the file which you pass to your bundler.

```js
"use client"
```

## Configuration

## Running tests

```
> npm run test
> npm run test --spec=01 --case=f
```