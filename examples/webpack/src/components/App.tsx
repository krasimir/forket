import { Suspense } from "react";
import Header from "./Header";
import { getQuote, getTotalNumberOfQuotes } from "../server-actions/quotes";
import Quote from "./Quote";

async function App({ request }: { request: object }) {
  const quote = await getQuote();

  return (
    <html>
      <head>
        <title>👋</title>
        <link rel="stylesheet" href="/assets/styles.css"></link>
      </head>
      <body>
        <Header />
        <Suspense fallback={<p className="tac">Loading...</p>}>
          <Quote quote={quote} totalNumberOfQuotes={getTotalNumberOfQuotes()} />
        </Suspense>
        <script src="/bundle.js"></script>
      </body>
    </html>
  );
}

export default App
