"use client";
import React, { useState, useTransition } from "react";
import { incrementLike } from "./actions.js";
function LikeButton({ initialCount }) {
  const [isPending, startTransition] = useTransition();
  const [likeCount, setLikeCount] = useState(initialCount);
  const onClick = () => {
    startTransition(async () => {
      const currentCount = await incrementLike();
      setLikeCount(currentCount);
    });
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("p", null, "Total Likes: ", likeCount), /* @__PURE__ */ React.createElement("button", { onClick, disabled: isPending }, "Like"));
}
export {
  LikeButton as default
};
