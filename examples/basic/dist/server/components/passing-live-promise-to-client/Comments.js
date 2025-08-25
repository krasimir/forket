"use client";
import React, { useEffect, useState } from "react";
function Comments({ commentsPromise }) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    commentsPromise.then((comments2) => {
      setComments(comments2);
    });
  }, [commentsPromise]);
  if (comments.length === 0) {
    return /* @__PURE__ */ React.createElement("p", null, "Loading comments...");
  }
  return comments.map((comment) => /* @__PURE__ */ React.createElement("p", { key: comment.id }, comment.content));
}
export {
  Comments as default
};
