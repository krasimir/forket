import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { COOKIES } from "../constants.js";
import DB from "../db.js";
import ImagesManager from "./ImagesManager.js";
import Expandable from "./Expandable.js";
const AFf_7 = async (id) => {
  "use server";
  await DB.deleteImage(id);
};
const AFf_6 = async (username) => {
  "use server";
  return await DB.getImagesByUsername(username);
};
async function App({ request }) {
  const username = request.cookies[COOKIES.name];
  let images = [];
  if (username) {
    images = await DB.getImagesByUsername(username);
  }
  return /* @__PURE__ */ React.createElement("html", null, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("title", null, "\u{1F44B}"), /* @__PURE__ */ React.createElement("link", { rel: "stylesheet", href: "/assets/styles.css" })), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(HeaderBoundary, { username, logout: "$FSA_f_25_logout" }), !username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(LoginFormBoundary, { login: "$FSA_f_26_login" })), username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(ImagesManagerBoundary, { username, getImages: "$FSA_f_23_AFf_6", deleteImage: "$FSA_f_24_AFf_7", initialImages: images })), /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement("div", { className: "loading-box mt2 pt1" }, /* @__PURE__ */ React.createElement(ExpandableBoundary, { label: "What's this?" }, /* @__PURE__ */ React.createElement("p", null, "This is an experimental app that exercises the implementation of React Server Components.")))), /* @__PURE__ */ React.createElement("script", { src: "/bundle.js" })));
}
function HeaderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "Header", "f_27"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_27", "data-c": "Header" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_27", "data-c": "Header" }), /* @__PURE__ */ React.createElement(Header, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_27", "data-c": "Header" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_27", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_27", "Header", ${JSON.stringify(serializedProps)});`
  } }));
}
function LoginFormBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "LoginForm", "f_28"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_28", "data-c": "LoginForm" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_28", "data-c": "LoginForm" }), /* @__PURE__ */ React.createElement(LoginForm, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_28", "data-c": "LoginForm" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_28", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_28", "LoginForm", ${JSON.stringify(serializedProps)});`
  } }));
}
function ImagesManagerBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "ImagesManager", "f_29"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_29", "data-c": "ImagesManager" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_29", "data-c": "ImagesManager" }), /* @__PURE__ */ React.createElement(ImagesManager, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_29", "data-c": "ImagesManager" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_29", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_29", "ImagesManager", ${JSON.stringify(serializedProps)});`
  } }));
}
function ExpandableBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "Expandable", "f_30"));
  const children = props.children;
  return /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_30", "data-c": "Expandable" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start/f_30", "data-c": "Expandable" }), /* @__PURE__ */ React.createElement(Expandable, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end/f_30", "data-c": "Expandable" }), /* @__PURE__ */ React.createElement("script", { id: "forket/init/f_30", dangerouslySetInnerHTML: {
    __html: `$F_booter(document.currentScript, "f_30", "Expandable", ${JSON.stringify(serializedProps)});`
  } }));
}
export {
  AFf_6,
  AFf_7,
  App as default
};
