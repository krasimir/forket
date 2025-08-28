import * as __WEBPACK_EXTERNAL_MODULE_body_parser_496b7721__ from "body-parser";
import * as __WEBPACK_EXTERNAL_MODULE_express__ from "express";
import * as __WEBPACK_EXTERNAL_MODULE_forket__ from "forket";
import * as __WEBPACK_EXTERNAL_MODULE_forket_lib_utils_serializeProps_js_ae048dd8__ from "forket/lib/utils/serializeProps.js";
import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "node:module";
import * as __WEBPACK_EXTERNAL_MODULE_react__ from "react";
import * as __WEBPACK_EXTERNAL_MODULE_react_jsx_dev_runtime_17c56db1__ from "react/jsx-dev-runtime";
/******/ var __webpack_modules__ = ({

/***/ "./build/server/components/App.tsx":
/*!*****************************************!*\
  !*** ./build/server/components/App.tsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var forket_lib_utils_serializeProps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! forket/lib/utils/serializeProps.js */ "forket/lib/utils/serializeProps.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _Header__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Header */ "./build/server/components/Header.tsx");
/* harmony import */ var _server_actions_quotes__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../server-actions/quotes */ "./build/server/server-actions/quotes.ts");
/* harmony import */ var _Quote__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./Quote */ "./build/server/components/Quote.tsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
var _jsxFileName = "/Users/krasimir/Work/Krasimir/forket/examples/webpack/build/server/components/App.tsx";






async function App({
  request
}) {
  const quote = await (0,_server_actions_quotes__WEBPACK_IMPORTED_MODULE_3__.getQuote)();
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("html", {
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("head", {
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("title", {
        children: "\uD83D\uDC4B"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 12,
        columnNumber: 9
      }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("link", {
        rel: "stylesheet",
        href: "/assets/styles.css"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 13,
        columnNumber: 9
      }, this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 11,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("body", {
      children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_Header__WEBPACK_IMPORTED_MODULE_2__["default"], {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 16,
        columnNumber: 9
      }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react__WEBPACK_IMPORTED_MODULE_1__.Suspense, {
        fallback: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("p", {
          className: "tac",
          children: "Loading..."
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 17,
          columnNumber: 29
        }, this),
        children: /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(QuoteBoundary, {
          quote: quote,
          totalNumberOfQuotes: (0,_server_actions_quotes__WEBPACK_IMPORTED_MODULE_3__.getTotalNumberOfQuotes)()
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 18,
          columnNumber: 11
        }, this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 17,
        columnNumber: 9
      }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("script", {
        src: "/bundle.js"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 20,
        columnNumber: 9
      }, this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 15,
      columnNumber: 7
    }, this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 10,
    columnNumber: 13
  }, this);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);
function QuoteBoundary(props) {
  const serializedProps = JSON.stringify((0,forket_lib_utils_serializeProps_js__WEBPACK_IMPORTED_MODULE_0__["default"])(props, "Quote", "f_6"));
  const children = props.children;
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
    children: [children && /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("template", {
      type: "forket/children",
      id: "f_6",
      "data-c": "Quote",
      children: children
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 29,
      columnNumber: 21
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("template", {
      type: "forket/start/f_6",
      "data-c": "Quote"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 32,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)(_Quote__WEBPACK_IMPORTED_MODULE_4__["default"], {
      ...props,
      children: children
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 33,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("template", {
      type: "forket/end/f_6",
      "data-c": "Quote"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 34,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxDEV)("script", {
      id: "forket/init/f_6",
      dangerouslySetInnerHTML: {
        __html: `$F_booter(document.currentScript, "f_6", "Quote", ${JSON.stringify(serializedProps)});`
      }
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 35,
      columnNumber: 7
    }, this)]
  }, void 0, true);
}

/***/ }),

/***/ "./build/server/components/Header.tsx":
/*!********************************************!*\
  !*** ./build/server/components/Header.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Header)
/* harmony export */ });
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
var _jsxFileName = "/Users/krasimir/Work/Krasimir/forket/examples/webpack/build/server/components/Header.tsx";

function Header() {
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("header", {
    className: "mx-auto flex space-between my2",
    style: {
      width: "240px"
    },
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("img", {
      src: "/assets/webpack.svg",
      alt: "Webpack logo",
      style: {
        width: "100px"
      }
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 5,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)("img", {
      src: "/assets/react.svg",
      alt: "React logo",
      style: {
        width: "100px"
      }
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 8,
      columnNumber: 7
    }, this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 2,
    columnNumber: 13
  }, this);
}

/***/ }),

/***/ "./build/server/components/Quote.tsx":
/*!*******************************************!*\
  !*** ./build/server/components/Quote.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Quote)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var _server_actions_quotes__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../server-actions/quotes */ "./build/server/server-actions/quotes.ts");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
"use client";

var _jsxFileName = "/Users/krasimir/Work/Krasimir/forket/examples/webpack/build/server/components/Quote.tsx";



function Quote({
  quote,
  totalNumberOfQuotes
}) {
  const [q, setQuote] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(quote);
  const [isPending, startTransition] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useTransition)();
  const total = (0,react__WEBPACK_IMPORTED_MODULE_0__.use)(totalNumberOfQuotes);
  return /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("div", {
    className: "mx-auto",
    style: {
      maxWidth: 600
    },
    children: [/*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("h1", {
      className: "tac",
      children: q.text
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 21,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("p", {
      className: "b tac",
      children: q.author
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 22,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("button", {
      className: "b my2 mx-auto",
      style: {
        width: "250px"
      },
      disabled: isPending,
      onClick: () => {
        startTransition(async () => {
          setQuote(await (0,_server_actions_quotes__WEBPACK_IMPORTED_MODULE_1__.getQuote)());
        });
      },
      children: "Get some more wisdom!"
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 23,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("hr", {}, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 35,
      columnNumber: 7
    }, this), /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxDEV)("p", {
      className: "tac",
      children: ["Total number of quotes: ", total.toLocaleString()]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 36,
      columnNumber: 7
    }, this)]
  }, void 0, true, {
    fileName: _jsxFileName,
    lineNumber: 20,
    columnNumber: 5
  }, this);
}

/***/ }),

/***/ "./build/server/forketServerActions.js":
/*!*********************************************!*\
  !*** ./build/server/forketServerActions.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ forketServerActions)
/* harmony export */ });
/* harmony import */ var _server_actions_quotes_ts__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./server-actions/quotes.ts */ "./build/server/server-actions/quotes.ts");


const actions = {
  $FSA_getQuote: _server_actions_quotes_ts__WEBPACK_IMPORTED_MODULE_0__.getQuote,
  $FSA_getTotalNumberOfQuotes: _server_actions_quotes_ts__WEBPACK_IMPORTED_MODULE_0__.getTotalNumberOfQuotes
};
async function forketServerActions(req, res) {
  res.setHeader("Content-Type", "application/json");
  if (!req.body && !req.files) {
    console.warn(`‎𐂐 Forket: the request object has no body.`);
    res.status(400).json({
      error: "No body provided"
    });
    return;
  }
  if (!req.body.__actionId) {
    console.warn(`‎𐂐 Forket: the request object body has no id.`);
    res.status(400).json({
      error: "No id provided"
    });
    return;
  }
  const id = req.body.__actionId;
  try {
    const context = {
      request: req,
      response: res
    };
    const result = await actions[id](req.body || {}, context);
    res.status(200).json({
      result
    });
  } catch (error) {
    console.error(`‎𐂐 Forket: error in server action ${id}:`, error);
    res.status(200).json({
      error: error.message || `Error in server action ${id}`
    });
  }
}

/***/ }),

/***/ "./build/server/server-actions/quotes.ts":
/*!***********************************************!*\
  !*** ./build/server/server-actions/quotes.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getQuote: () => (/* binding */ getQuote),
/* harmony export */   getTotalNumberOfQuotes: () => (/* binding */ getTotalNumberOfQuotes)
/* harmony export */ });
'use server';

async function getQuote() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  const quotes = [{
    text: "The only limit to our realization of tomorrow is our doubts of today.",
    author: "Franklin D. Roosevelt"
  }, {
    text: "In the middle of every difficulty lies opportunity.",
    author: "Albert Einstein"
  }, {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  }, {
    text: "Do what you can, with what you have, where you are.",
    author: "Theodore Roosevelt"
  }, {
    text: "It always seems impossible until it's done.",
    author: "Nelson Mandela"
  }, {
    text: "Happiness depends upon ourselves.",
    author: "Aristotle"
  }, {
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt"
  }, {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci"
  }, {
    text: "Your time is limited, so don’t waste it living someone else’s life.",
    author: "Steve Jobs"
  }, {
    text: "Not everything that can be counted counts, and not everything that counts can be counted.",
    author: "Albert Einstein"
  }];
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}
async function getTotalNumberOfQuotes() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return 1342989;
}

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_body_parser_496b7721__;

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_express__;

/***/ }),

/***/ "forket":
/*!*************************!*\
  !*** external "forket" ***!
  \*************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_forket__;

/***/ }),

/***/ "forket/lib/utils/serializeProps.js":
/*!*****************************************************!*\
  !*** external "forket/lib/utils/serializeProps.js" ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_forket_lib_utils_serializeProps_js_ae048dd8__;

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("http");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_react__;

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_react_jsx_dev_runtime_17c56db1__;

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("url");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./build/server/server.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _forketServerActions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./forketServerActions.js */ "./build/server/forketServerActions.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! http */ "http");
/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! express */ "express");
/* harmony import */ var url__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! url */ "url");
/* harmony import */ var body_parser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! body-parser */ "body-parser");
/* harmony import */ var forket__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! forket */ "forket");
/* harmony import */ var _components_App__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/App */ "./build/server/components/App.tsx");
/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-dev-runtime */ "react/jsx-dev-runtime");
var _jsxFileName = "/Users/krasimir/Work/Krasimir/forket/examples/webpack/build/server/server.js";










const __filename = (0,url__WEBPACK_IMPORTED_MODULE_5__.fileURLToPath)("file:///Users/krasimir/Work/Krasimir/forket/examples/webpack/build/server/server.js");
const __dirname = path__WEBPACK_IMPORTED_MODULE_2__.dirname(__filename);
const port = 8087;
const app = (0,express__WEBPACK_IMPORTED_MODULE_4__["default"])();
const server = http__WEBPACK_IMPORTED_MODULE_3__.createServer(app);
app.use(body_parser__WEBPACK_IMPORTED_MODULE_6__["default"].json());
app.use(express__WEBPACK_IMPORTED_MODULE_4__["default"]["static"](path__WEBPACK_IMPORTED_MODULE_2__.resolve(path__WEBPACK_IMPORTED_MODULE_2__.join(__dirname, "..", "..", "dist", "public"))));
(0,forket__WEBPACK_IMPORTED_MODULE_7__["default"])().then(forket => {
  app.use("/@forket", forket.forketServerActions(_forketServerActions_js__WEBPACK_IMPORTED_MODULE_0__["default"]));
  const handler = forket.serveApp({
    factory: req => /*#__PURE__*/(0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxDEV)(_components_App__WEBPACK_IMPORTED_MODULE_8__["default"], {
      request: req
    }, void 0, false, {
      fileName: _jsxFileName,
      lineNumber: 20,
      columnNumber: 25
    }, undefined)
  });
  app.get("/examples/:example", handler);
  app.get("/", handler);
});
server.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});
})();


//# sourceMappingURL=server.js.map