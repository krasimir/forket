import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import login from "../server-actions/login.js";
import { logout } from '../server-actions/logout.js';
export default function App({ request }) {
    const username = request.cookies?.forket;
    return (<html>
      <head>
        <title>React Example</title>
        <link rel="stylesheet" href="/assets/styles.css"/>
      </head>
      <body>
        <HeaderBoundary username={username} logout={"$FSA_f_7"}/>
        <section className="container mxauto">{!username && <LoginFormBoundary login={"$FSA_f_8"}/>}</section>
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function HeaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_9>{children}</boundary_children_f_9>
      <boundary_props_f_9 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_9 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_9", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_9", "Header"]);
        })();`
    }}/>
      <boundary_f_9>
        <Header {...props} children={children}/>
      </boundary_f_9>
    </>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_10>{children}</boundary_children_f_10>
      <boundary_props_f_10 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_10 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_10", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_10", "LoginForm"]);
        })();`
    }}/>
      <boundary_f_10>
        <LoginForm {...props} children={children}/>
      </boundary_f_10>
    </>);
}
