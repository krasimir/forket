import * as __WEBPACK_EXTERNAL_MODULE_react__ from "react";
import * as __WEBPACK_EXTERNAL_MODULE_react_jsx_dev_runtime_17c56db1__ from "react/jsx-dev-runtime";
/******/ var __webpack_modules__ = ({

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
/*!*******************************************!*\
  !*** ./build/server/components/Quote.tsx ***!
  \*******************************************/
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
})();

const __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=Quote.js.map