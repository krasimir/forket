import React from 'react';

import AddInteractivity from './adding-interactivity-to-server-components/Page.js';
import AsyncComponents from './async-components-with-server-components/Page.js';
import CreatingServerFunction from './creating-server-function-from-server-component/Page.js';
import ImportingServerFunctions from './importing-server-functions-from-client-components/Page.js';
import ServerFunctionsWithActions from './server-functions-with-actions/Page.js';
import ServerFunctionsWithForm from './server-functions-with-form-actions/Page.js';
import HowUseClient from './how-use-client-marks-client-code/Page.js';
import CallingServerFunctionOutside from './calling-server-function-outside-form/Page.js';
import PassingLivePromise from './passing-live-promise-to-client/Page.js';

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
    title: "Passing live server promise to client (no Suspense)",
    reactdocs: "https://react.dev/reference/rsc/server-components#async-components-with-server-components",
    route: "passing-live-promise-to-client",
    Page: PassingLivePromise
  },
  {
    title: "How 'use client' marks client code",
    reactdocs: "https://react.dev/reference/rsc/use-client#how-use-client-marks-client-code",
    route: "how-use-client-marks-client-code",
    Page: HowUseClient
  },
  {
    title: "Creating a Server Function from a Server Component",
    reactdocs: "https://react.dev/reference/rsc/server-functions#creating-a-server-function-from-a-server-component",
    route: "creating-server-function-from-server-component",
    Page: CreatingServerFunction
  },
  {
    title: "Importing Server Functions from Client Components",
    reactdocs: "https://react.dev/reference/rsc/server-functions#importing-server-functions-from-client-components",
    route: "importing-server-functions-from-client-components",
    Page: ImportingServerFunctions
  },
  {
    title: "Server Functions with Actions",
    reactdocs: "https://react.dev/reference/rsc/server-functions#server-functions-with-actions",
    route: "server-fucntions-with-actions",
    Page: ServerFunctionsWithActions
  },
  {
    title: "Server Functions with Form Actions",
    reactdocs: "https://react.dev/reference/rsc/server-functions#using-server-functions-with-form-actions",
    route: "server-functions-with-form-actions",
    Page: ServerFunctionsWithForm
  },
  {
    title: "Calling a Server Function outside of <form>",
    reactdocs: "https://react.dev/reference/rsc/use-server#calling-a-server-function-outside-of-form",
    route: "calling-server-function-outside-form",
    Page: CallingServerFunctionOutside
  }
];

export default function App({ request }) {
  const currentRoute = request?.params?.example;
  const currentExample = EXAMPLES.find(e => e.route === currentRoute);
  let page;

  if (!currentExample) {
    page = <HomePage />;
  } else {
    const ExamplePage = currentExample.Page;
    page = <ExamplePage example={currentExample}/>;
  }

  return (
    <html>
      <head>
        <title>👋</title>
        <link rel="stylesheet" href="/assets/styles.css" />
      </head>
      <body>
        {page}
        <script src="/bundle.js" async defer></script>
      </body>
    </html>
  );
}

function HomePage() {
  return EXAMPLES.map((example) => {
    return (
      <div className="container" key={example.title}>
        <h2>{example.title}</h2>
        <p>
          <a href={`/examples/${example.route}`} rel="noopener noreferrer" className="mr1">
            👉 View example
          </a>
          <a href={example.reactdocs} target="_blank" rel="noopener noreferrer">
            ⚛️ React docs
          </a>
        </p>
      </div>
    );
  })
}