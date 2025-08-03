import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./index.css";

// Because of how Vite handles the CSS importing we have to mention the main App
// component somehow here. Otherwise all the imported CSS files are considered
// unused and not injected onto the page.

console.log(typeof App);