import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./components/App";
const anotherModule = require("utils/anotherModule");
function Test() {
    const m = require('utils/testModule');
}
hydrateRoot(document, /*#__PURE__*/ React.createElement(App, null));
