import { useState, Suspense } from "react";
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import "./App.css";

import EmptyNote from "./EmptyNote.js";

function App() {
  return (
    <>
      <header>
        <h1>Hey</h1>
      </header>
      <EmptyNote />
      <script type="module" src="/@vite/client"></script>
    </>
  );
}

export default App
