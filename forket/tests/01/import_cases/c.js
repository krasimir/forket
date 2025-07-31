const swc = require("@swc/core");
const chalk = require("chalk");

const { getNode, resolveImport, printGraph } = require("./graph");
const { ROLE } = require("./constants.js");

const MODE = {
  CLIENT: "client",
  SERVER: "server"
};
