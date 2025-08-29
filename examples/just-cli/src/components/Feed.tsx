"use client";

import { likePost } from "../actions";

export default function User({ posts }) {
  return (
    <div>
      {posts.map((post) => (
        <div>
          <p>{post.text}</p>
          <button onClick={() => likePost(post.id)}>Like</button>
        </div>
      ))}
    </div>
  );
}