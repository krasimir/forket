import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { login, logout } from "../server-actions/auth.js";
import { processImage, updateImage } from "../server-actions/data.js";
import { COOKIES } from "../constants.js";
import DB from '../db.js';
import ImagesManager from "./ImagesManager.js";
export default async function App({ request }) {
    const username = request.cookies[COOKIES.name];
    let images: any[] = [];
    if (username) {
        images = await DB.getImagesByUsername(username);
    }
    return (<html>
      <head>
        <title>👋</title>
        <link rel="stylesheet" href="/assets/styles.css"/>
      </head>
      <body>
        <HeaderBoundary username={username} logout={"$FSA_logout"}/>
        {!username && (<section className="container mxauto">
            <LoginFormBoundary login={"$FSA_login"}/>
          </section>)}
        {username && (<section className="container mxauto">
            <ImagesManagerBoundary processImage={"$FSA_processImage"} updateImage={"$FSA_updateImage"} images={images}/>            
          </section>)}
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function HeaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_20", "Header", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="f_20" data-c="Header">
          {children}
        </template>)}
      <template type="forket/start" id="f_20" data-c="Header"></template>
      <Header {...props} children={children}/>
      <template type="forket/end" id="f_20" data-c="Header"></template>
    </>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_21", "LoginForm", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="f_21" data-c="LoginForm">
          {children}
        </template>)}
      <template type="forket/start" id="f_21" data-c="LoginForm"></template>
      <LoginForm {...props} children={children}/>
      <template type="forket/end" id="f_21" data-c="LoginForm"></template>
    </>);
}
function ImagesManagerBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_22", "ImagesManager", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="f_22" data-c="ImagesManager">
          {children}
        </template>)}
      <template type="forket/start" id="f_22" data-c="ImagesManager"></template>
      <ImagesManager {...props} children={children}/>
      <template type="forket/end" id="f_22" data-c="ImagesManager"></template>
    </>);
}
