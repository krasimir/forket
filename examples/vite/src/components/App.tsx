import { useState, Suspense } from "react";
import Header from "./Header";
import {getQuote} from "../server-actions/quotes";
import Quote from "./Quote";


async function App({ js, css, viteClient }: { js: string[], css: string[], viteClient: boolean }) {
  const quote = await getQuote();

  return (
    <html>
      <head>
        <title>👋</title>
        {css.map((file) => (
          <link rel="stylesheet" href={file} key={file}></link>
        ))}
      </head>
      <body>
        <Header />
        <Quote quote={quote} />
        {viteClient && <script type="module" src="/@vite/client"></script>}
        {js.map((file) => (
          <script type="module" src={file} key={file}></script>
        ))}
      </body>
    </html>
  );
}

export default App
