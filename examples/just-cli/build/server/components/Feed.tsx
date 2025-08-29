"use client";
import { useState, useEffect } from "react";

import { likePost } from "../actions";

export default function User({ posts, numOfComments, children }) {
  const [n, setN] = useState(numOfComments);

  useEffect(() => {
    numOfComments.then((res) => setN(res));
  }, [])

  return (
    <div>
      <p>Num of comments: {n}</p>
      {posts.map((post) => (
        <div>
          <p>{post.text}</p>
          <button onClick={() => likePost(post.id)}>Like</button>
        </div>
      ))}
      {children}
    </div>
  );
}