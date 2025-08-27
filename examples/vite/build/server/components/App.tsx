import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import { useState, Suspense } from "react";
import reactLogo from '../assets/react.svg';
import EmptyNote from "./EmptyNote.js";
function App({ js, css, viteClient }: {
    js: string[];
    css: string[];
    viteClient: boolean;
}) {
    return (<html>
      <head>
        <title>👋</title>
        {css.map((file)=>(<link rel="stylesheet" href={file} key={file}></link>))}
      </head>
      <body>
        <header>
          <img src={reactLogo} alt="React logo"/>
        </header>
        <EmptyNoteBoundary/>
        {viteClient && <script type="module" src="/@vite/client"></script>}
        {js.map((file)=>(<script type="module" src={file} key={file}></script>))}
      </body>
    </html>);
}
export default App;
function EmptyNoteBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "EmptyNote", "f_8"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_8" data-c="EmptyNote">
          {children}
        </template>)}
      <template type="forket/start/f_8" data-c="EmptyNote"></template>
      <EmptyNote {...props} children={children}/>
      <template type="forket/end/f_8" data-c="EmptyNote"></template>
      <script id="forket/init/f_8" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_8", "EmptyNote", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
