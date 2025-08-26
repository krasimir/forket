"use client";
import React, { use, useState } from "react";
export default function Comments({ commentsPromise }) {
    console.log("Comments---------------------", commentsPromise);
    const [likes, setLikes] = useState({});
    const comments = use(commentsPromise);
    console.log({
        likes
    });
    return (<div>
      <h3>Comments:</h3>
      {comments.map((comment)=>{
        return (<div key={comment.id}>
            <p key={comment.id}>{comment.content}</p>
            <button onClick={()=>{
            console.log('click');
            setLikes((current)=>{
                return {
                    ...current,
                    [comment.id]: (current[comment.id] || 0) + 1
                };
            });
        }}>👍 {likes[comment.id] || 0}</button>
          </div>);
    })}
    </div>);
}
