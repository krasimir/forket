import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from 'react';
import Header from './Header.js';
import LoginForm from './LoginForm.js';
export async function login(data, context) {
    "use server";
    await new Promise((resolve)=>setTimeout(resolve, 2000));
    throw new Error('Ops');
    if (!data.username || data.username === '') {
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
    const isLoggedIn = false;
    return (<html>
      <head>
        <title>React Example</title>
        <link rel="stylesheet" href="/assets/styles.css"/>
      </head>
      <body>
        <Header/>
        <section className="container mxauto">{!isLoggedIn && <LoginFormBoundary login={"$FSA_f_1"}/>}</section>
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_f_0>{children}</boundary_children_f_0>
      <boundary_props_f_0 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_f_0 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_0", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_0", "LoginForm"]);
        })();`
    }}/>
      <boundary_f_0>
        <LoginForm {...props} children={children}/>
      </boundary_f_0>
    </>);
}
