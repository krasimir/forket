# 𐂐 forket

## Mental model

The idea of this library is to work before your usual pipeline kicks in. Forket does static analyses of your code and produces client and server versions. After that you have to hook your current building tools to process the files - creating client bundle and running HTTP server.

<p align="center">
  <img width="500" src="../assets/project_whitebg.png">
</p>

## Installation

```
> npm install forket
```‎

## Running tests

```
> npm run test
> npm run test --spec=01 --case=f
```