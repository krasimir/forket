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
    const serializedProps = JSON.stringify(forketSerializeProps(props, "FancyText", "f_37"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_37", "FancyText", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="f_37" data-c="FancyText">
          {children}
        </template>)}
      <template type="forket/start" id="f_37" data-c="FancyText"></template>
      <FancyText {...props} children={children}/>
      <template type="forket/end" id="f_37" data-c="FancyText"></template>
    </>);
}
function InspirationGeneratorBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "InspirationGenerator", "f_38"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_38", "InspirationGenerator", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="f_38" data-c="InspirationGenerator">
          {children}
        </template>)}
      <template type="forket/start" id="f_38" data-c="InspirationGenerator"></template>
      <InspirationGenerator {...props} children={children}/>
      <template type="forket/end" id="f_38" data-c="InspirationGenerator"></template>
    </>);
}
