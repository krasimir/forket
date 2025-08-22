"use client";
import React, { use } from "react";
export default function Comments({ commentsPromise }) {
    const comments = use(commentsPromise);
    return comments.map((comment)=><p key={comment.id}>{comment.content}</p>);
}
