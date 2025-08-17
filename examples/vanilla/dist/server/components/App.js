import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { COOKIES } from "../constants.js";
import ImageUploader from "./ImageUploader.js";
function App({ request }) {
  const username = request.cookies[COOKIES.name];
  return /* @__PURE__ */ React.createElement("html", null, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("title", null, "\u{1F44B}"), /* @__PURE__ */ React.createElement("link", { rel: "stylesheet", href: "/assets/styles.css" })), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(HeaderBoundary, { username, logout: "$FSA_logout" }), /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, !username && /* @__PURE__ */ React.createElement(LoginFormBoundary, { login: "$FSA_login" })), username && /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, /* @__PURE__ */ React.createElement(ImageUploaderBoundary, { processImage: "$FSA_processImage" })), /* @__PURE__ */ React.createElement("script", { src: "/bundle.js" })));
}
function HeaderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_11", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_11", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_11", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_11", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_11", "Header"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_11", null, /* @__PURE__ */ React.createElement(Header, { ...props, children })));
}
function LoginFormBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_12", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_12", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_12", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_12", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_12", "LoginForm"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_12", null, /* @__PURE__ */ React.createElement(LoginForm, { ...props, children })));
}
function ImageUploaderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_13", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_13", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_13", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_13", "ImageUploader"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_13", "ImageUploader"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_13", null, /* @__PURE__ */ React.createElement(ImageUploader, { ...props, children })));
}
export {
  App as default
};
