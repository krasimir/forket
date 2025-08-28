import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import { Suspense } from "react";
import Header from "./Header";
import { getQuote, getTotalNumberOfQuotes } from "../server-actions/quotes";
import Quote from "./Quote";
async function App({ request }: {
    request: object;
}) {
    const quote = await getQuote();
    return (<html>
      <head>
        <title>👋</title>
        <link rel="stylesheet" href="/assets/styles.css"></link>
      </head>
      <body>
        <Header/>
        <Suspense fallback={<p className="tac">Loading...</p>}>
          <QuoteBoundary quote={quote} totalNumberOfQuotes={getTotalNumberOfQuotes()}/>
        </Suspense>
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
export default App;
function QuoteBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Quote", "f_6"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_6" data-c="Quote">
          {children}
        </template>)}
      <template type="forket/start/f_6" data-c="Quote"></template>
      <Quote {...props} children={children}/>
      <template type="forket/end/f_6" data-c="Quote"></template>
      <script id="forket/init/f_6" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_6", "Quote", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
