import { useState, Suspense } from "react";
import reactLogo from '../assets/react.svg'

import "./styles.css";

import EmptyNote from "./EmptyNote.js";

function App({ clientBundleFile }: { clientBundleFile: string }) {
  return (
    <html>
      <head>
        <title>👋</title>
      </head>
      <body>
        <header>
          <h1>Hey</h1>
        </header>
        <EmptyNote />
        <script type="module" src="/@vite/client"></script>
        <script type="module" src={clientBundleFile}></script>
      </body>
    </html>
  );
}

export default App
