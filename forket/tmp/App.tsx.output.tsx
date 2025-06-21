import React, { Suspense } from "react";

import Products from "./Products";

import { getProducts } from "./db";

export default async function App() {
  return (
    <html>
      <head>
        <Title />
      </head>
      <body>
        <div id="root">
          <h1>React Example</h1>
          <Suspense fallback={<p>Loading products...</p>}>
            <Products getProducts={getProducts()} />
          </Suspense>
        </div>
      </body>
    </html>
  );
}

function Title() {
  return <title>React Example</title>;
}
