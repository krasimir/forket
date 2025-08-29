import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { COOKIES } from "../constants.js";
import DB from "../db.js";
import ImagesManager from "./ImagesManager.js";
import Expandable from "./Expandable.js";
const AFf_7 = async ({ data: [id] }) => {
  "use server";
  await DB.deleteImage(id);
};
const AFf_6 = async ({ data: [username] }) => {
  "use server";
  return await DB.getImagesByUsername(username);
};
async function App({ request }) {
  const username = request.cookies[COOKIES.name];
  let images = [];
  if (username) {
    images = await DB.getImagesByUsername(username);
  }
  return /* @__PURE__ */ React.createElement("html", null, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("title", null, "\u{1F44B}"), /* @__PURE__ */ React.createElement("link", { rel: "stylesheet", href: "/assets/styles.css" })), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(HeaderBoundary, { username, logout: "$FSA_logout" }), !username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(LoginFormBoundary, { login: "$FSA_login" })), username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(ImagesManagerBoundary, { username, getImages: "$FSA_AFf_6", deleteImage: "$FSA_AFf_7", initialImages: images })), /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement("div", { className: "loading-box mt2 pt1" }, /* @__PURE__ */ React.createElement(ExpandableBoundary, { label: "What's this?" }, /* @__PURE__ */ React.createElement("p", null, "This is an experimental app that exercises the implementation of React Server Components.")))), /* @__PURE__ */ React.createElement("script", { src: "/bundle.js" })));
}
function HeaderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "Header", "f_23"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_23", "data-c": "Header" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_23", "data-c": "Header" }), /* @__PURE__ */ React.createElement(Header, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_23", "data-c": "Header" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_23", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_23", "Header", ${JSON.stringify(serializedProps)});`
  } }));
}
function LoginFormBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "LoginForm", "f_24"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_24", "data-c": "LoginForm" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_24", "data-c": "LoginForm" }), /* @__PURE__ */ React.createElement(LoginForm, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_24", "data-c": "LoginForm" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_24", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_24", "LoginForm", ${JSON.stringify(serializedProps)});`
  } }));
}
function ImagesManagerBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "ImagesManager", "f_25"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_25", "data-c": "ImagesManager" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_25", "data-c": "ImagesManager" }), /* @__PURE__ */ React.createElement(ImagesManager, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_25", "data-c": "ImagesManager" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_25", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_25", "ImagesManager", ${JSON.stringify(serializedProps)});`
  } }));
}
function ExpandableBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "Expandable", "f_26"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_26", "data-c": "Expandable" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_26", "data-c": "Expandable" }), /* @__PURE__ */ React.createElement(Expandable, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_26", "data-c": "Expandable" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_26", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_26", "Expandable", ${JSON.stringify(serializedProps)});`
  } }));
}
export {
  AFf_6,
  AFf_7,
  App as default
};
