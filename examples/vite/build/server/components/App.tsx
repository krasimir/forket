import { useState, Suspense } from "react";
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import "./App.css";
import Products from './Products';

function App() {
  return (
    <>
      <header>
        <h1>Hello world</h1>
      </header>
      <Suspense>
        <Products />
      </Suspense>
      <footer>I'm a footer</footer>
    </>
  );
}

export default App
