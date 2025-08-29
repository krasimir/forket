# 𐂐 forket

## Mental model

The idea of this library is to work before your usual pipeline kicks in. Forket does static analyses of your code and produces client and server versions. After that you have to hook your current building tools to process the files - compile/transpile, create client bundles and running HTTP server. There is a small example [here](../examples//just-cli/) that demonstrates that split (check out the [src](../examples/just-cli/src/) directory and result [build](../examples/just-cli/build/)).

<p align="center">
  <img width="500" src="../assets/project_whitebg.png">
</p>

## Installation

```
> npm install forket
```‎

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

## Running tests

```
> npm run test
> npm run test --spec=01 --case=f
```