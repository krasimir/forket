#!/usr/bin/env node
import Forket from "./index.js";

Forket().then((forket) => {
  forket.process();
});
