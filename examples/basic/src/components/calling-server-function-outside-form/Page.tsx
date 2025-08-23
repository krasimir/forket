import React from 'react';

import LikeButton from "./LikeButton.js";
import { getLikeCount } from "./actions.js";

export default function Page({ example }) {
  return (
    <div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr />
      <LikeButton initialCount={getLikeCount()} />
    </div>
  );
}

