import React from "react";

import Header from "./Header.js";
import LoginForm from "./LoginForm.js";

import login from "../server-actions/login.js";
import { logout } from '../server-actions/logout.js'

export default function App({ request }) {
  const username = request.cookies?.forket;

  return (
    <html>
      <head>
        <title>React Example</title>
        <link rel="stylesheet" href="/assets/styles.css" />
      </head>
      <body>
        <Header username={username} logout={logout} />
        <section className="container mxauto">{!username && <LoginForm login={login} />}</section>
        <script src="/bundle.js"></script>
      </body>
    </html>
  );
}
