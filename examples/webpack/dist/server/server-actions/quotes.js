/******/ // The require scope
/******/ var __webpack_require__ = {};
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
/*!***********************************************!*\
  !*** ./build/server/server-actions/quotes.ts ***!
  \***********************************************/
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
const __webpack_exports__getQuote = __webpack_exports__.getQuote;
const __webpack_exports__getTotalNumberOfQuotes = __webpack_exports__.getTotalNumberOfQuotes;
export { __webpack_exports__getQuote as getQuote, __webpack_exports__getTotalNumberOfQuotes as getTotalNumberOfQuotes };

//# sourceMappingURL=quotes.js.map