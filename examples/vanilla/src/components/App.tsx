import React from "react";

import Header from "./Header.js";
import LoginForm from "./LoginForm.js";

import { login, logout } from "../server-actions/auth.js";

export default function App({ request }) {
  const username = request.cookies?.ricardo_name;

  return (
    <html>
      <head>
        <title>Ricardo: 👋</title>
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
