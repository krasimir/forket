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
export default function App({ request }) {
    const username = request.cookies[COOKIES.name];
    return (<html>
      <head>
        <title>👋</title>
        <link rel="stylesheet" href="/assets/styles.css"/>
      </head>
      <body>
        <HeaderBoundary username={username} logout={"$FSA_logout"}/>
        <section className="container mxauto">{!username && <LoginFormBoundary login={"$FSA_login"}/>}</section>
        {username && (<section className="container mxauto">
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
      <boundary_children_f_11>{children}</boundary_children_f_11>
      <boundary_props_f_11 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_11 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_11", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_11", "Header"]);
        })();`
    }}/>
      <boundary_f_11>
        <Header {...props} children={children}/>
      </boundary_f_11>
    </>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_12>{children}</boundary_children_f_12>
      <boundary_props_f_12 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_12 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_12", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_12", "LoginForm"]);
        })();`
    }}/>
      <boundary_f_12>
        <LoginForm {...props} children={children}/>
      </boundary_f_12>
    </>);
}
function ImageUploaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_13>{children}</boundary_children_f_13>
      <boundary_props_f_13 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_13 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_13", "ImageUploader"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_13", "ImageUploader"]);
        })();`
    }}/>
      <boundary_f_13>
        <ImageUploader {...props} children={children}/>
      </boundary_f_13>
    </>);
}
