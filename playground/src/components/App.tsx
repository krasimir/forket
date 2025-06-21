import React from "react";

import Products from "./Products";

// export default function App() {
//   return (
//     <html>
//       <head>
//         <title>Forket</title>
//       </head>
//       <body>
//         <h1>Hey, world</h1>
//       </body>
//     </html>
//   );
// }

export default async function App() {
  const { products } = await fetch("/api/products").then((res) => res.json());

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
