import React, { Suspense } from "react";

import Products from "./Products.js";

export default function App() {
  return (
    <html>
      <head>
        <Title />
      </head>
      <body>
        <div>
          <header>
            <h1>Hello world</h1>
          </header>
          {/* <Suspense> */}
            <Products />
          {/* </Suspense> */}
          <footer>I'm a footer</footer>
        </div>
      </body>
    </html>
  );
}

export function Title() {
  return <title>React Example</title>;
}