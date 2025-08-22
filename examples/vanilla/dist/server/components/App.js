import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { COOKIES } from "../constants.js";
import DB from "../db.js";
import ImagesManager from "./ImagesManager.js";
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
  return /* @__PURE__ */ React.createElement("html", null, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("title", null, "\u{1F44B}"), /* @__PURE__ */ React.createElement("link", { rel: "stylesheet", href: "/assets/styles.css" })), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(HeaderBoundary, { username, logout: "$FSA_logout" }), !username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(LoginFormBoundary, { login: "$FSA_login" })), username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(ImagesManagerBoundary, { username, processImage: "$FSA_processImage", updateImage: "$FSA_updateImage", getImages: "$FSA_AFf_6", deleteImage: "$FSA_AFf_7", initialImages: images })), /* @__PURE__ */ React.createElement("script", { src: "/bundle.js" })));
}
function HeaderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "Header", "f_22"));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
          let a = ["f_22", "Header", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
  } }), children && children.length > 0 && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_22", "data-c": "Header" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start", id: "f_22", "data-c": "Header" }), /* @__PURE__ */ React.createElement(Header, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end", id: "f_22", "data-c": "Header" }));
}
function LoginFormBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "LoginForm", "f_23"));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
          let a = ["f_23", "LoginForm", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
  } }), children && children.length > 0 && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_23", "data-c": "LoginForm" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start", id: "f_23", "data-c": "LoginForm" }), /* @__PURE__ */ React.createElement(LoginForm, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end", id: "f_23", "data-c": "LoginForm" }));
}
function ImagesManagerBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "ImagesManager", "f_24"));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
          let a = ["f_24", "ImagesManager", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
  } }), children && children.length > 0 && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_24", "data-c": "ImagesManager" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start", id: "f_24", "data-c": "ImagesManager" }), /* @__PURE__ */ React.createElement(ImagesManager, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end", id: "f_24", "data-c": "ImagesManager" }));
}
export {
  AFf_6,
  AFf_7,
  App as default
};
