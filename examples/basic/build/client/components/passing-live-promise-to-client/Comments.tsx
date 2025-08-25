"use client";
import React, { useEffect, useState } from "react";
export default function Comments({ commentsPromise }) {
    const [comments, setComments] = useState([]);
    useEffect(()=>{
        commentsPromise.then((comments)=>{
            setComments(comments);
        });
    }, [
        commentsPromise
    ]);
    if (comments.length === 0) {
        return <p>Loading comments...</p>;
    }
    return comments.map((comment)=><p key={comment.id}>{comment.content}</p>);
}
