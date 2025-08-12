import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
export function logout(data, context) {
    "use server";
    context.response.clearCookie("forket");
    return true;
}
export async function login(data, context) {
    "use server";
    await new Promise((resolve)=>setTimeout(resolve, 2000));
    if (!data.username || data.username === "") {
        return false;
    }
    context.response.cookie("forket", data.username, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60,
        secure: false
    });
    return true;
}
export default function App({ request }) {
    const username = request.cookies?.forket;
    return (<html>
      <head>
        <title>React Example</title>
        <link rel="stylesheet" href="/assets/styles.css"/>
      </head>
      <body>
        <HeaderBoundary username={username} logout={"$FSA_f_3"}/>
        <section className="container mxauto">{!username && <LoginFormBoundary login={"$FSA_f_2"}/>}</section>
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function HeaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_0>{children}</boundary_children_f_0>
      <boundary_props_f_0 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_0 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_0", "Header"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_0", "Header"]);
        })();`
    }}/>
      <boundary_f_0>
        <Header {...props} children={children}/>
      </boundary_f_0>
    </>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_1>{children}</boundary_children_f_1>
      <boundary_props_f_1 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_1 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_1", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_1", "LoginForm"]);
        })();`
    }}/>
      <boundary_f_1>
        <LoginForm {...props} children={children}/>
      </boundary_f_1>
    </>);
}
