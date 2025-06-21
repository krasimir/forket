import React from "react";

import Products from "./Products";

import { getProducts } from "./db";

export default async function App() {
  const { products } = await getProducts();

  return (
    <html>
      <head>
        <title>Forket</title>
      </head>
      <body>
        <div id="root">
          <h1>React Example</h1>
          <Products products={products} />
        </div>
      </body>
    </html>
  );
}
