"use client";
import React, { useState } from "react";
import inspirations from "./inspirations.js";
import FancyText from "./FancyText.js";
export default function InspirationGenerator({ children }) {
    const [index, setIndex] = useState(0);
    const quote = inspirations[index];
    const next = ()=>setIndex((index + 1) % inspirations.length);
    return (<>
      <p>Your inspirational quote is:</p>
      <FancyText text={quote}/>
      <button onClick={next}>Inspire me again</button>
      {children}
    </>);
}
