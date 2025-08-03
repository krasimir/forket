import React from 'react';
import Header from './Header.js';
import LoginForm from './LoginForm.js';
export default function App({ request }) {
    const isLoggedIn = request.cookies?.forket;
    async function login(formData) {
        "use server";
        console.log("form submitted");
    }
    return (<html>
      <head>
        <title>React Example</title>
        <link rel="stylesheet" href="/assets/styles.css"/>
      </head>
      <body>
        <Header/>
        <section className="container mxauto">{!isLoggedIn && <LoginFormBoundary login={login}/>}</section>
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
function forketSerializeProps(props) {
    function isValidElement(obj) {
        const keys = Object.keys(obj);
        return (typeof obj === "object" && obj !== null && keys.includes("_owner") && keys.includes("_store") && keys.includes("props"));
    }
    if (props == null || typeof props !== "object") return props;
    if (Array.isArray(props)) {
        return props.map(forketSerializeProps);
    }
    if (isValidElement(props)) {
        return false;
    }
    const serialized = {};
    for(const key in props){
        const value = props[key];
        if (typeof value === "function") {
            serialized[key] = "$FRSC_function";
            continue;
        }
        const serializedProp = forketSerializeProps(value);
        if (serializedProp !== false) {
            serialized[key] = forketSerializeProps(value);
        }
    }
    return serialized;
}
