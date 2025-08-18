import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { login, logout } from "../server-actions/auth.js";
import { processImage, updateImage } from "../server-actions/data.js";
import { COOKIES } from "../constants.js";
import ImageUploader from "./ImageUploader.js";
import DB from '../db.js';
import ImagesList from "./ImagesList.js";
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
            <ImageUploaderBoundary processImage={"$FSA_processImage"} updateImage={"$FSA_updateImage"}/>
            <ImagesListBoundary images={images}/>
          </section>)}
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function HeaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script type="forket/props" id="f_19" dangerouslySetInnerHTML={{
        __html: serializedProps
    }}></script>
      <template type="forket/children" id="f_19">
        {children}
      </template>
      <template type="forket/start" id="f_19"></template>
      <Header {...props} children={children}/>
      <template type="forket/end" id="f_19"></template>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_19", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_19", "Header"]);
        })();`
    }}></script>
    </>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script type="forket/props" id="f_20" dangerouslySetInnerHTML={{
        __html: serializedProps
    }}></script>
      <template type="forket/children" id="f_20">
        {children}
      </template>
      <template type="forket/start" id="f_20"></template>
      <LoginForm {...props} children={children}/>
      <template type="forket/end" id="f_20"></template>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_20", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_20", "LoginForm"]);
        })();`
    }}></script>
    </>);
}
function ImageUploaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script type="forket/props" id="f_21" dangerouslySetInnerHTML={{
        __html: serializedProps
    }}></script>
      <template type="forket/children" id="f_21">
        {children}
      </template>
      <template type="forket/start" id="f_21"></template>
      <ImageUploader {...props} children={children}/>
      <template type="forket/end" id="f_21"></template>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_21", "ImageUploader"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_21", "ImageUploader"]);
        })();`
    }}></script>
    </>);
}
function ImagesListBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script type="forket/props" id="f_22" dangerouslySetInnerHTML={{
        __html: serializedProps
    }}></script>
      <template type="forket/children" id="f_22">
        {children}
      </template>
      <template type="forket/start" id="f_22"></template>
      <ImagesList {...props} children={children}/>
      <template type="forket/end" id="f_22"></template>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_22", "ImagesList"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_22", "ImagesList"]);
        })();`
    }}></script>
    </>);
}
