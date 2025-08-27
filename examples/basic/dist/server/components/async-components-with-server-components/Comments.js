"use client";
import React, { use, useState } from "react";
function Comments({ commentsPromise }) {
  const [likes, setLikes] = useState({});
  const comments = use(commentsPromise);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", null, "Comments:"), comments.map((comment) => {
    return /* @__PURE__ */ React.createElement("div", { key: comment.id }, /* @__PURE__ */ React.createElement("p", { key: comment.id }, comment.content), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setLikes((current) => {
        return {
          ...current,
          [comment.id]: (current[comment.id] || 0) + 1
        };
      });
    } }, "\u{1F44D} ", likes[comment.id] || 0));
  }));
}
export {
  Comments as default
};
