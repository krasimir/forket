import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import login from "../server-actions/login.js";
function App({ request }) {
  const username = request.cookies?.forket;
  function logout(data, context) {
    "use server";
    context.response.clearCookie("forket");
    return true;
  }
  return /* @__PURE__ */ React.createElement("html", null, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("title", null, "React Example"), /* @__PURE__ */ React.createElement("link", { rel: "stylesheet", href: "/assets/styles.css" })), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(HeaderBoundary, { username, logout }), /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, !username && /* @__PURE__ */ React.createElement(LoginFormBoundary, { login })), /* @__PURE__ */ React.createElement("script", { src: "/bundle.js" })));
}
function HeaderBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_6", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_6", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_6", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_6", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_6", "Header"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_6", null, /* @__PURE__ */ React.createElement(Header, { ...props, children })));
}
function LoginFormBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_7", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_7", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_7", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_7", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_7", "LoginForm"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_7", null, /* @__PURE__ */ React.createElement(LoginForm, { ...props, children })));
}
export {
  App as default
};
