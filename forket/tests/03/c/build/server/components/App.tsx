import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Page01 from './case01/Page.js';
import Page02 from './case02/Page.js';
export default async function App() {
    return <p>Hey</p>;
}
function Page01Boundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Page01", "f_7"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_7" data-c="Page01">
          {children}
        </template>)}
      <template type="forket/start/f_7" data-c="Page01"></template>
      <Page01 {...props} children={children}/>
      <template type="forket/end/f_7" data-c="Page01"></template>
      <script id="forket/init/f_7" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_7", "Page01", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
function Page02Boundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Page02", "f_8"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_8" data-c="Page02">
          {children}
        </template>)}
      <template type="forket/start/f_8" data-c="Page02"></template>
      <Page02 {...props} children={children}/>
      <template type="forket/end/f_8" data-c="Page02"></template>
      <script id="forket/init/f_8" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_8", "Page02", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
