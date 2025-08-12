import React from 'react';

import Header from './Header.js'
import LoginForm from './LoginForm.js';

export default function App({ request }) {
  // const isLoggedIn = request.cookies?.forket;
  const isLoggedIn = false;

  async function login(data, context) {
    "use server";
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
    throw new Error('Ops');
    if (!data.username || data.username === '') {
      return false;
    }
    context.response.cookie("forket", data.username, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 hour
      secure: false // allow in local dev without HTTPS
    });
    return true;
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