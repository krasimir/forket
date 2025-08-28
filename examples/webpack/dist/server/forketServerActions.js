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
/*!*********************************************!*\
  !*** ./build/server/forketServerActions.js ***!
  \*********************************************/
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
})();

const __webpack_exports__default = __webpack_exports__["default"];
export { __webpack_exports__default as default };

//# sourceMappingURL=forketServerActions.js.map