import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { login, logout } from "../server-actions/auth.js";
import { processImage } from "../server-actions/data.js";
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
        {!username && <section className="container mxauto">
          <LoginFormBoundary login={"$FSA_login"}/>
        </section>}
        {username && (<section className="container mxauto">
            <ImagesListBoundary images={images}/>
            <ImageUploaderBoundary processImage={"$FSA_processImage"}/>
          </section>)}
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function HeaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_19>{children}</boundary_children_f_19>
      <boundary_props_f_19 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_19 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_19", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_19", "Header"]);
        })();`
    }}/>
      <boundary_f_19>
        <Header {...props} children={children}/>
      </boundary_f_19>
    </>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_20>{children}</boundary_children_f_20>
      <boundary_props_f_20 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_20 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_20", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_20", "LoginForm"]);
        })();`
    }}/>
      <boundary_f_20>
        <LoginForm {...props} children={children}/>
      </boundary_f_20>
    </>);
}
function ImageUploaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_21>{children}</boundary_children_f_21>
      <boundary_props_f_21 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_21 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_21", "ImageUploader"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_21", "ImageUploader"]);
        })();`
    }}/>
      <boundary_f_21>
        <ImageUploader {...props} children={children}/>
      </boundary_f_21>
    </>);
}
function ImagesListBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_22>{children}</boundary_children_f_22>
      <boundary_props_f_22 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_22 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_22", "ImagesList"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_22", "ImagesList"]);
        })();`
    }}/>
      <boundary_f_22>
        <ImagesList {...props} children={children}/>
      </boundary_f_22>
    </>);
}
