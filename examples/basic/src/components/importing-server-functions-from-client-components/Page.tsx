import React, { Suspense } from "react";

import EmptyNote from "./EmptyNote.js";

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
      <EmptyNote />
    </div>
  );
}
