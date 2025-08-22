"use client";
import React from "react";
import ReactDOMClient from "react-dom/client";
import Expandable from "./components/adding-interactivity-to-server-components/Expandable";
import Comments from "./components/async-components-with-server-components/Comments";
window.React = React;
window.ReactDOMClient = ReactDOMClient;
window.Comments = Comments;
window.Expandable = Expandable;
