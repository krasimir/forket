import React from "react";

import Header from "./Header.js";
import LoginForm from "./LoginForm.js";

import { login, logout } from "../server-actions/auth.js";
import { processImage } from "../server-actions/data.js";
import { COOKIES } from "../constants.js";
import ImageUploader from "./ImageUploader.js";

export default function App({ request }) {
  const username = request.cookies[COOKIES.name];

  return (
    <html>
      <head>
        <title>👋</title>
        <link rel="stylesheet" href="/assets/styles.css" />
      </head>
      <body>
        <Header username={username} logout={logout} />
        <section className="container mxauto">{!username && <LoginForm login={login} />}</section>
        {username && (
          <section className="container mxauto">
            <ImageUploader processImage={processImage}/>
          </section>
        )}
        <script src="/bundle.js"></script>
      </body>
    </html>
  );
}
