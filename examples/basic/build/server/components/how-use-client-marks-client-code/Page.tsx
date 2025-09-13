import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React, { Suspense } from "react";
import FancyText from "./FancyText.js";
import InspirationGenerator from "./InspirationGenerator.js";
import Copyright from "./Copyright.js";
export default async function Page({ example }) {
    return (<div className="container">
      <p className="flex space-between">
        <a href="/">👈 Back</a>
        <a href={example.reactdocs} target="_blank">
          <small>⚛️ React docs</small>
        </a>
      </p>
      <hr/>
      <FancyTextBoundary title text="Get Inspired App"/>
      <InspirationGeneratorBoundary>
        <Copyright year={2004}/>
      </InspirationGeneratorBoundary>
    </div>);
}
function FancyTextBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "FancyText", "f_43"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_43" data-c="FancyText">
          {children}
        </template>)}
      <template type="forket/start/f_43" data-c="FancyText"></template>
      <FancyText {...props} children={children}/>
      <template type="forket/end/f_43" data-c="FancyText"></template>
      <script id="forket/init/f_43" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_43", "FancyText", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
function InspirationGeneratorBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "InspirationGenerator", "f_44"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_44" data-c="InspirationGenerator">
          {children}
        </template>)}
      <template type="forket/start/f_44" data-c="InspirationGenerator"></template>
      <InspirationGenerator {...props} children={children}/>
      <template type="forket/end/f_44" data-c="InspirationGenerator"></template>
      <script id="forket/init/f_44" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_44", "InspirationGenerator", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
