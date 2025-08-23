import React, { Suspense } from "react";

import FancyText from "./FancyText.js";
import InspirationGenerator from "./InspirationGenerator.js";
import Copyright from "./Copyright.js";

export default async function Page({ example }) {
  return (
    <div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr />
      <FancyText title text="Get Inspired App" />
      <InspirationGenerator>
        <Copyright year={2004} />
      </InspirationGenerator>
    </div>
  );
}
