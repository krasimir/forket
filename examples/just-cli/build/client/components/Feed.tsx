"use client";
const likePost = function(...args) {
    return window.FSA_call("$FSA_likePost", "likePost")(...args);
};
export default function User({ posts }) {
    return (<div>
      {posts.map((post)=>(<div>
          <p>{post.text}</p>
          <button onClick={()=>likePost(post.id)}>Like</button>
        </div>))}
    </div>);
}
