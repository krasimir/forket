import { useState, Suspense } from "react";
import reactLogo from '../assets/react.svg'

import EmptyNote from "./EmptyNote.js";

function App({ js, css, viteClient }: { js: string[], css: string[], viteClient: boolean }) {
  return (
    <html>
      <head>
        <title>👋</title>
        {css.map((file) => (
          <link rel="stylesheet" href={file} key={file}></link>
        ))}
      </head>
      <body>
        <header>
          <img src={reactLogo} alt="React logo" />
        </header>
        <EmptyNote />
        {viteClient && <script type="module" src="/@vite/client"></script>}
        {js.map((file) => (
          <script type="module" src={file} key={file}></script>
        ))}
      </body>
    </html>
  );
}

export default App
