import React from "react";

import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { login, logout } from "../server-actions/auth.js";
import { processImage, updateImage } from "../server-actions/data.js";
import { COOKIES } from "../constants.js";
import ImageUploader from "./ImageUploader.js";
import DB from '../db.js';
import ImagesList from "./ImagesList.js";
import ImagesProvider from "../contexts/ImagesContext.js";

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
            <ImagesProvider initialImages={images}>
              <ImageUploader processImage={processImage} updateImage={updateImage} />
              <ImagesList />
            </ImagesProvider>
          </section>
        )}
        <script src="/bundle.js"></script>
      </body>
    </html>
  );
}
