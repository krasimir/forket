import Feed from "./Feed";

async function getPosts() {
  const res = await fetch('https://site.com/api/posts');
  return res.json();
}
async function getNumOfCommnets() {
  const res = await fetch('https://site.com/api/comments/count');
  return res.json();
}

export default async function App() {
  const posts = await getPosts();
  const numOfComments = getNumOfCommnets();

  return (
    <div>
      <Feed posts={posts} numOfComments={numOfComments}>
        <p>Feed posts update once a day.</p>
      </Feed>
    </div>
  );
}