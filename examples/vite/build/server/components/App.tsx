import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import { useState, Suspense } from "react";
import Header from "./Header";
import { getQuote } from "../server-actions/quotes";
import Quote from "./Quote";
async function App({ js, css, viteClient }: {
    js: string[];
    css: string[];
    viteClient: boolean;
}) {
    const quote = await getQuote();
    return (<html>
      <head>
        <title>👋</title>
        {css.map((file)=>(<link rel="stylesheet" href={file} key={file}></link>))}
      </head>
      <body>
        <Header/>
        <QuoteBoundary quote={quote}/>
        {viteClient && <script type="module" src="/@vite/client"></script>}
        {js.map((file)=>(<script type="module" src={file} key={file}></script>))}
      </body>
    </html>);
}
export default App;
function QuoteBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Quote", "f_8"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_8" data-c="Quote">
          {children}
        </template>)}
      <template type="forket/start/f_8" data-c="Quote"></template>
      <Quote {...props} children={children}/>
      <template type="forket/end/f_8" data-c="Quote"></template>
      <script id="forket/init/f_8" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_8", "Quote", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
