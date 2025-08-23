'use client';

import React, { useState, useTransition } from "react";
import { incrementLike } from "./actions.js";

export default function LikeButton({ initialCount }) {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(initialCount);

  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };

  return (
    <>
      <p>Total Likes: {likeCount}</p>
      <button onClick={onClick} disabled={isPending}>
        Like
      </button>
    </>
  );
}
