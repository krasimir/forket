"use client";
import { useState, useEffect } from "react";
const likePost = function(...args) {
    return window.FSA_call("$FSA_f_8_likePost", "likePost")(...args);
};
export default function User({ posts, numOfComments, children }) {
    const [n, setN] = useState(numOfComments);
    useEffect(()=>{
        numOfComments.then((res)=>setN(res));
    }, []);
    return (<div>
      <p>Num of comments: {n}</p>
      {posts.map((post)=>(<div>
          <p>{post.text}</p>
          <button onClick={()=>likePost(post.id)}>Like</button>
        </div>))}
      {children}
    </div>);
}
