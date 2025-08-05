import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
function App({ request }) {
  const isLoggedIn = request.cookies?.forket;
  async function login(formData) {
    "use server";
    console.log("form submitted");
  }
  return /* @__PURE__ */ React.createElement("html", null, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("title", null, "React Example"), /* @__PURE__ */ React.createElement("link", { rel: "stylesheet", href: "/assets/styles.css" })), /* @__PURE__ */ React.createElement("body", null, /* @__PURE__ */ React.createElement(Header, null), /* @__PURE__ */ React.createElement("section", { className: "container mxauto" }, !isLoggedIn && /* @__PURE__ */ React.createElement(LoginFormBoundary, { login }))));
}
function LoginFormBoundary(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("boundary_children_f_0", null, children), /* @__PURE__ */ React.createElement("boundary_props_f_0", { dangerouslySetInnerHTML: {
    __html: serializedProps
  } }), /* @__PURE__ */ React.createElement("boundary_setup_f_0", { dangerouslySetInnerHTML: {
    __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_0", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_0", "LoginForm"]);
        })();`
  } }), /* @__PURE__ */ React.createElement("boundary_f_0", null, /* @__PURE__ */ React.createElement(LoginForm, { ...props, children })));
}
export {
  App as default
};
