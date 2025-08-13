import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { login, logout } from "../server-actions/auth.js";
export default function App({ request }) {
    const username = request.cookies?.ricardo_name;
    return (<html>
      <head>
        <title>Ricardo: 👋</title>
        <link rel="stylesheet" href="/assets/styles.css"/>
      </head>
      <body>
        <HeaderBoundary username={username} logout={"$FSA_f_36"}/>
        <section className="container mxauto">{!username && <LoginFormBoundary login={"$FSA_f_37"}/>}</section>
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function HeaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_38>{children}</boundary_children_f_38>
      <boundary_props_f_38 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_38 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_38", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_38", "Header"]);
        })();`
    }}/>
      <boundary_f_38>
        <Header {...props} children={children}/>
      </boundary_f_38>
    </>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_39>{children}</boundary_children_f_39>
      <boundary_props_f_39 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_39 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_39", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_39", "LoginForm"]);
        })();`
    }}/>
      <boundary_f_39>
        <LoginForm {...props} children={children}/>
      </boundary_f_39>
    </>);
}
