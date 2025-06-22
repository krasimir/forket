import { useState } from 'react';

async function App() {
  return <p className="mt-1">Hello</p>
}
const Comp2 = async () => {
  const [state, setState] = useState('initial');
  return <span className="mt-1">{state}</span>
}
const Comp3 = async () => {
  const [state, setState] = useState("initial");
  if (state === "initial") {
    return <span className="mt-1">{state}</span>;
  }
  return null
};