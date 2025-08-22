import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { login, logout } from "../server-actions/auth.js";
import { processImage, updateImage } from "../server-actions/data.js";
import { COOKIES } from "../constants.js";
import DB from '../db.js';
import ImagesManager from "./ImagesManager.js";
export const AFf_7 = async ({ data: [id] })=>{
    "use server";
    await DB.deleteImage(id);
};
export const AFf_6 = async ({ data: [username] })=>{
    "use server";
    return await DB.getImagesByUsername(username);
};
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
            <ImagesManagerBoundary username={username} processImage={"$FSA_processImage"} updateImage={"$FSA_updateImage"} getImages={"$FSA_AFf_6"} deleteImage={"$FSA_AFf_7"} initialImages={images}/>
          </section>)}
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function HeaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Header", "f_22"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_22", "Header", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="f_22" data-c="Header">
          {children}
        </template>)}
      <template type="forket/start" id="f_22" data-c="Header"></template>
      <Header {...props} children={children}/>
      <template type="forket/end" id="f_22" data-c="Header"></template>
    </>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "LoginForm", "f_23"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_23", "LoginForm", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="f_23" data-c="LoginForm">
          {children}
        </template>)}
      <template type="forket/start" id="f_23" data-c="LoginForm"></template>
      <LoginForm {...props} children={children}/>
      <template type="forket/end" id="f_23" data-c="LoginForm"></template>
    </>);
}
function ImagesManagerBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "ImagesManager", "f_24"));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["f_24", "ImagesManager", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="f_24" data-c="ImagesManager">
          {children}
        </template>)}
      <template type="forket/start" id="f_24" data-c="ImagesManager"></template>
      <ImagesManager {...props} children={children}/>
      <template type="forket/end" id="f_24" data-c="ImagesManager"></template>
    </>);
}
