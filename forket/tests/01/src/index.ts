import React from "react";
import { hydrateRoot } from "react-dom/client";
import "./index.css";

import data from './data/data.json';

import App from "./components/App";

const foobar = require('./foobar')
const data2 = require('./data/data2.json')

async function test() {
  const foo = await import("./A/B");
  const { default: bar } = await import("./C/D");
  const { cat, dog } = await import("./E/F");
}

hydrateRoot(document, <App />);
