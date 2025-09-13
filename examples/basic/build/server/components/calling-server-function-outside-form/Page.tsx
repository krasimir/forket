import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from 'react';
import LikeButton from "./LikeButton.js";
import { getLikeCount } from "./actions.js";
export default function Page({ example }) {
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <LikeButtonBoundary initialCount={getLikeCount()}/>
    </div>);
}
function LikeButtonBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "LikeButton", "f_40"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_40" data-c="LikeButton">
          {children}
        </template>)}
      <template type="forket/start/f_40" data-c="LikeButton"></template>
      <LikeButton {...props} children={children}/>
      <template type="forket/end/f_40" data-c="LikeButton"></template>
      <script id="forket/init/f_40" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_40", "LikeButton", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
