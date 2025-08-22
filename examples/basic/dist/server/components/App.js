import React from "react";
import AddInteractivity from "./adding-interactivity-to-server-components/Page.js";
import AsyncComponents from "./async-components-with-server-components/Page.js";
const EXAMPLES = [
  {
    title: "Adding interactivity to Server Components",
    reactdocs: "https://react.dev/reference/rsc/server-components#adding-interactivity-to-server-components",
    route: "adding-interactivity-to-server-components",
    Page: AddInteractivity
  },
  {
    title: "Async components with Server Components",
    reactdocs: "https://react.dev/reference/rsc/server-components#async-components-with-server-components",
    route: "async-components-with-server-components",
    Page: AsyncComponents
  }
];
function App({ request }) {
  const currentRoute = request?.params?.example;
  const currentExample = EXAMPLES.find((e) => e.route === currentRoute);
  let page;
  if (!currentExample) {
    page = /* @__PURE__ */ React.createElement(HomePage, null);
  } else {
    const ExamplePage = currentExample.Page;
    page = /* @__PURE__ */ React.createElement(ExamplePage, { example: currentExample });
  }
  return /* @__PURE__ */ React.createElement("html", null, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement("title", null, "\u{1F44B}"), /* @__PURE__ */ React.createElement("link", { rel: "stylesheet", href: "/assets/styles.css" })), /* @__PURE__ */ React.createElement("body", null, page, /* @__PURE__ */ React.createElement("script", { src: "/bundle.js" })));
}
function HomePage() {
  return EXAMPLES.map((example) => {
    return /* @__PURE__ */ React.createElement("div", { className: "container", key: example.title }, /* @__PURE__ */ React.createElement("h2", null, example.title), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("a", { href: `/examples/${example.route}`, rel: "noopener noreferrer", className: "mr1" }, "\u{1F449} View example"), /* @__PURE__ */ React.createElement("a", { href: example.reactdocs, target: "_blank", rel: "noopener noreferrer" }, "\u269B\uFE0F React docs")));
  });
}
export {
  App as default
};
