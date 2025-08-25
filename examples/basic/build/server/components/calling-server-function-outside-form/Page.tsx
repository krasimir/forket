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
    const serializedProps = JSON.stringify(forketSerializeProps(props, "LikeButton", "f_38"));
    const children = props.children;
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_38", "LikeButton", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="f_38" data-c="LikeButton">
          {children}
        </template>)}
      <template type="forket/start" id="f_38" data-c="LikeButton"></template>
      <LikeButton {...props} children={children}/>
      <template type="forket/end" id="f_38" data-c="LikeButton"></template>
    </>);
}
