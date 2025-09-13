import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Page01 from './case01/Page.js';
import Page02 from './case02/Page.js';
import Page03 from './case03/Page.js';
export default async function App() {
    return <p>Hey</p>;
}
function Page01Boundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Page01", "f_9"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_9" data-c="Page01">
          {children}
        </template>)}
      <template type="forket/start/f_9" data-c="Page01"></template>
      <Page01 {...props} children={children}/>
      <template type="forket/end/f_9" data-c="Page01"></template>
      <script id="forket/init/f_9" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_9", "Page01", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
function Page02Boundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Page02", "f_10"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_10" data-c="Page02">
          {children}
        </template>)}
      <template type="forket/start/f_10" data-c="Page02"></template>
      <Page02 {...props} children={children}/>
      <template type="forket/end/f_10" data-c="Page02"></template>
      <script id="forket/init/f_10" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_10", "Page02", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
function Page03Boundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Page03", "f_11"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_11" data-c="Page03">
          {children}
        </template>)}
      <template type="forket/start/f_11" data-c="Page03"></template>
      <Page03 {...props} children={children}/>
      <template type="forket/end/f_11" data-c="Page03"></template>
      <script id="forket/init/f_11" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_11", "Page03", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
