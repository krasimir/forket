"use client";
import React, { use } from "react";
function Comments({ commentsPromise }) {
  const comments = use(commentsPromise);
  return comments.map((comment) => /* @__PURE__ */ React.createElement("p", { key: comment.id }, comment.content));
}
export {
  Comments as default
};
