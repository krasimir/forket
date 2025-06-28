import React, { Suspense } from "react";

import Products from "./Products";

export default function App() {
  return (
    <html>
      <head>
        <Title />
      </head>
      <body>
        <div id="root">
          <header>
            <h1>Hello world</h1>
          </header>
          <Suspense>
            <Products />
          </Suspense>
          <footer>I'm a footer</footer>
        </div>
      </body>
    </html>
  );
}

function Title() {
  return <title>React Example</title>;
}
