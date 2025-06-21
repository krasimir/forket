import React from "react";

import Products from "./Products";

let cache: any = null;

async function getProducts() {
  if (cache) return cache;
  return cache = fetch("http://localhost:8087/api/products");  
}

export default async function App() {
  const { products } = await getProducts().then(res => res.json());

  return (
    <html>
      <head>
        <title>Forket</title>
      </head>
      <body>
        <div id="root">
          <h1>React Streaming Example</h1>
          <Products products={products} />
        </div>
      </body>
    </html>
  );
}
