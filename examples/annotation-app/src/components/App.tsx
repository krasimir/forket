import React from "react";

import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { login, logout } from "../server-actions/auth.js";
import { COOKIES } from "../constants.js";
import DB from '../db.js';
import ImagesManager from "./ImagesManager.js";
import Expandable from "./Expandable.js";

export default async function App({ request }) {
  const username = request.cookies[COOKIES.name];
  let images: any[] = [];

  if (username) {
    images = await DB.getImagesByUsername(username);
  }

  return (
    <html>
      <head>
        <title>👋</title>
        <link rel="stylesheet" href="/assets/styles.css" />
      </head>
      <body>
        <Header username={username} logout={logout} />
        {!username && (
          <section className="container mxauto">
            <LoginForm login={login} />
          </section>
        )}
        {username && (
          <section className="container mxauto">
            <ImagesManager
              username={username}
              getImages={async (username) => {
                "use server";
                return await DB.getImagesByUsername(username);
              }}
              deleteImage={async (id) => {
                "use server";
                await DB.deleteImage(id);
              }}
              initialImages={images}
            />
          </section>
        )}
        <section className="container mxauto">
          <div className="loading-box mt2 pt1">
            <Expandable label="What's this?">
              <p>This is an experimental app that exercises the implementation of React Server Components.</p>
            </Expandable>
          </div>
        </section>
        <script src="/bundle.js"></script>
      </body>
    </html>
  );
}
