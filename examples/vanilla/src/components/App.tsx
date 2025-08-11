import React from 'react';

import Header from './Header.js'
import LoginForm from './LoginForm.js';

export default function App({ request }) {
  const isLoggedIn = request.cookies?.forket;

  async function login(data) {
    "use server";
    console.log("form submitted", data);
  }

  return (
    <html>
      <head>
        <title>React Example</title>
        <link rel="stylesheet" href="/assets/styles.css" />
      </head>
      <body>
        <Header />
        <section className="container mxauto">{!isLoggedIn && <LoginForm login={login} />}</section>
        <script src="/bundle.js"></script>
      </body>
    </html>
  );
}