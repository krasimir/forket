import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { COOKIES } from "../constants.js";
import ImageUploader from "./ImageUploader.js";
import DB from "../db.js";
import ImagesList from "./ImagesList.js";
import ImagesProvider from "../contexts/ImagesContext.js";
async function App({ request }) {
  const username = request.cookies[COOKIES.name];
  let images = [];
  if (username) {
    images = await DB.getImagesByUsername(username);
  }
  return /* @__PURE__ */ React.createElement("html", null, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("title", null, "\u{1F44B}"), /* @__PURE__ */ React.createElement("link", { rel: "stylesheet", href: "/assets/styles.css" })), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(HeaderBoundary, { username, logout: "$FSA_logout" }), !username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(LoginFormBoundary, { login: "$FSA_login" })), username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(ImagesProviderBoundary, { initialImages: images }, /* @__PURE__ */ React.createElement(ImageUploaderBoundary, { processImage: "$FSA_processImage", updateImage: "$FSA_updateImage" }), /* @__PURE__ */ React.createElement(ImagesListBoundary, null))), /* @__PURE__ */ React.createElement("script", { src: "/bundle.js" })));
}
function HeaderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_20", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_20", "Header", ${JSON.stringify(serializedProps)}]);
        })();`
  } }), children && children.length > 0 && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_20", "data-c": "Header" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start", id: "f_20", "data-c": "Header" }), /* @__PURE__ */ React.createElement(Header, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end", id: "f_20", "data-c": "Header" }));
}
function LoginFormBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_21", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_21", "LoginForm", ${JSON.stringify(serializedProps)}]);
        })();`
  } }), children && children.length > 0 && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_21", "data-c": "LoginForm" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start", id: "f_21", "data-c": "LoginForm" }), /* @__PURE__ */ React.createElement(LoginForm, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end", id: "f_21", "data-c": "LoginForm" }));
}
function ImageUploaderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_22", "ImageUploader"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_22", "ImageUploader", ${JSON.stringify(serializedProps)}]);
        })();`
  } }), children && children.length > 0 && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_22", "data-c": "ImageUploader" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start", id: "f_22", "data-c": "ImageUploader" }), /* @__PURE__ */ React.createElement(ImageUploader, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end", id: "f_22", "data-c": "ImageUploader" }));
}
function ImagesListBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_23", "ImagesList"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_23", "ImagesList", ${JSON.stringify(serializedProps)}]);
        })();`
  } }), children && children.length > 0 && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_23", "data-c": "ImagesList" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start", id: "f_23", "data-c": "ImagesList" }), /* @__PURE__ */ React.createElement(ImagesList, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end", id: "f_23", "data-c": "ImagesList" }));
}
function ImagesProviderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("script", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_24", "ImagesProvider"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_24", "ImagesProvider", ${JSON.stringify(serializedProps)}]);
        })();`
  } }), children && children.length > 0 && /* @__PURE__ */ React.createElement("template", { type: "forket/children", id: "f_24", "data-c": "ImagesProvider" }, children), /* @__PURE__ */ React.createElement("template", { type: "forket/start", id: "f_24", "data-c": "ImagesProvider" }), /* @__PURE__ */ React.createElement(ImagesProvider, { ...props, children }), /* @__PURE__ */ React.createElement("template", { type: "forket/end", id: "f_24", "data-c": "ImagesProvider" }));
}
export {
  App as default
};
