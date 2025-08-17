import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { COOKIES } from "../constants.js";
import ImageUploader from "./ImageUploader.js";
import DB from "../db.js";
import ImagesList from "./ImagesList.js";
async function App({ request }) {
  const username = request.cookies[COOKIES.name];
  let images = [];
  if (username) {
    images = await DB.getImagesByUsername(username);
  }
  return /* @__PURE__ */ React.createElement("html", null, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("title", null, "\u{1F44B}"), /* @__PURE__ */ React.createElement("link", { rel: "stylesheet", href: "/assets/styles.css" })), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(HeaderBoundary, { username, logout: "$FSA_logout" }), !username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(LoginFormBoundary, { login: "$FSA_login" })), username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(ImagesListBoundary, { images }), /* @__PURE__ */ React.createElement(ImageUploaderBoundary, { processImage: "$FSA_processImage" })), /* @__PURE__ */ React.createElement("script", { src: "/bundle.js" })));
}
function HeaderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_19", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_19", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_19", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_19", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_19", "Header"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_19", null, /* @__PURE__ */ React.createElement(Header, { ...props, children })));
}
function LoginFormBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_20", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_20", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_20", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_20", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_20", "LoginForm"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_20", null, /* @__PURE__ */ React.createElement(LoginForm, { ...props, children })));
}
function ImageUploaderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_21", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_21", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_21", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_21", "ImageUploader"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_21", "ImageUploader"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_21", null, /* @__PURE__ */ React.createElement(ImageUploader, { ...props, children })));
}
function ImagesListBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_22", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_22", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_22", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_22", "ImagesList"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_22", "ImagesList"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_22", null, /* @__PURE__ */ React.createElement(ImagesList, { ...props, children })));
}
export {
  App as default
};
