import Feed from "./Feed";

async function getPosts() {
  const res = await fetch('https://site.com/api/posts');
  return res.json();
}

export default async function App() {
  const posts = await getPosts();

  return (
    <div>
      <Feed posts={posts} />
    </div>
  );
}