import forketSerializeProps from "forket/lib/utils/serializeProps.js";
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
import ImagesProvider from "../contexts/ImagesContext.js";
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
            <ImagesProviderBoundary initialImages={images}>
              <ImageUploaderBoundary processImage={"$FSA_processImage"} updateImage={"$FSA_updateImage"}/>
              <ImagesListBoundary/>
            </ImagesProviderBoundary>
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
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_20", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_20", "Header", ${JSON.stringify(serializedProps)}]);
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
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_21", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_21", "LoginForm", ${JSON.stringify(serializedProps)}]);
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
function ImageUploaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_22", "ImageUploader"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_22", "ImageUploader", ${JSON.stringify(serializedProps)}]);
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="f_22" data-c="ImageUploader">
          {children}
        </template>)}
      <template type="forket/start" id="f_22" data-c="ImageUploader"></template>
      <ImageUploader {...props} children={children}/>
      <template type="forket/end" id="f_22" data-c="ImageUploader"></template>
    </>);
}
function ImagesListBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_23", "ImagesList"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_23", "ImagesList", ${JSON.stringify(serializedProps)}]);
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="f_23" data-c="ImagesList">
          {children}
        </template>)}
      <template type="forket/start" id="f_23" data-c="ImagesList"></template>
      <ImagesList {...props} children={children}/>
      <template type="forket/end" id="f_23" data-c="ImagesList"></template>
    </>);
}
function ImagesProviderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_24", "ImagesProvider"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_24", "ImagesProvider", ${JSON.stringify(serializedProps)}]);
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="f_24" data-c="ImagesProvider">
          {children}
        </template>)}
      <template type="forket/start" id="f_24" data-c="ImagesProvider"></template>
      <ImagesProvider {...props} children={children}/>
      <template type="forket/end" id="f_24" data-c="ImagesProvider"></template>
    </>);
}
