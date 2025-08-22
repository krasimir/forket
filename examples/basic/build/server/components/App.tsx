import React from 'react';
import AddInteractivity from './adding-interactivity-to-server-components/Page.js';
import AsyncComponents from './async-components-with-server-components/Page.js';
import CreatingServerFunction from './creating-server-function-from-server-component/Page.js';
const EXAMPLES = [
    {
        title: "Adding interactivity to Server Components",
        reactdocs: "https://react.dev/reference/rsc/server-components#adding-interactivity-to-server-components",
        route: "adding-interactivity-to-server-components",
        Page: AddInteractivity
    },
    {
        title: "Async components with Server Components",
        reactdocs: "https://react.dev/reference/rsc/server-components#async-components-with-server-components",
        route: "async-components-with-server-components",
        Page: AsyncComponents
    },
    {
        title: "Creating a Server Function from a Server Component",
        reactdocs: "https://react.dev/reference/rsc/server-functions#creating-a-server-function-from-a-server-component",
        route: "creating-server-function-from-server-component",
        Page: CreatingServerFunction
    }
];
export default function App({ request }) {
    const currentRoute = request?.params?.example;
    const currentExample = EXAMPLES.find((e)=>e.route === currentRoute);
    let page;
    if (!currentExample) {
        page = <HomePage/>;
    } else {
        const ExamplePage = currentExample.Page;
        page = <ExamplePage example={currentExample}/>;
    }
    return (<html>
      <head>
        <title>👋</title>
        <link rel="stylesheet" href="/assets/styles.css"/>
      </head>
      <body>
        {page}
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function HomePage() {
    return EXAMPLES.map((example)=>{
        return (<div className="container" key={example.title}>
        <h2>{example.title}</h2>
        <p>
          <a href={`/examples/${example.route}`} rel="noopener noreferrer" className="mr1">
            👉 View example
          </a>
          <a href={example.reactdocs} target="_blank" rel="noopener noreferrer">
            ⚛️ React docs
          </a>
        </p>
      </div>);
    });
}
