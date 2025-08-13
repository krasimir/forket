import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import login from '../server-actions/login.js';
export default function App({ request }) {
    const username = request.cookies?.forket;
    function logout(data, context) {
        "use server";
        context.response.clearCookie("forket");
        return true;
    }
    return (<html>
      <head>
        <title>React Example</title>
        <link rel="stylesheet" href="/assets/styles.css"/>
      </head>
      <body>
        <HeaderBoundary username={username} logout={logout}/>
        <section className="container mxauto">{!username && <LoginFormBoundary login={login}/>}</section>
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function HeaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_6>{children}</boundary_children_f_6>
      <boundary_props_f_6 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_6 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_6", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_6", "Header"]);
        })();`
    }}/>
      <boundary_f_6>
        <Header {...props} children={children}/>
      </boundary_f_6>
    </>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_7>{children}</boundary_children_f_7>
      <boundary_props_f_7 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_7 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_7", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_7", "LoginForm"]);
        })();`
    }}/>
      <boundary_f_7>
        <LoginForm {...props} children={children}/>
      </boundary_f_7>
    </>);
}
