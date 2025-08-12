import React from "react";
function Header({ username }) {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("header", { className: "mxauto mt2 mb3" }, /* @__PURE__ */ React.createElement("img", { src: "/assets/logo_white_350x84.png", alt: "forket logo", width: "200", className: "block mxauto" }), username && /* @__PURE__ */ React.createElement("h1", { className: "mt1 tac" }, "Hey, ", username, "!")));
}
export {
  Header as default
};
