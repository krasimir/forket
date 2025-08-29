import forketSerializeProps from "forket/lib/utils/serializeProps.js";
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
    return (<div>
      <FeedBoundary posts={posts} numOfComments={numOfComments}>
        <p>Feed posts update once a day.</p>
      </FeedBoundary>
    </div>);
}
function FeedBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Feed", "f_6"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_6" data-c="Feed">
          {children}
        </template>)}
      <template type="forket/start/f_6" data-c="Feed"></template>
      <Feed {...props} children={children}/>
      <template type="forket/end/f_6" data-c="Feed"></template>
      <script id="forket/init/f_6" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_6", "Feed", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
