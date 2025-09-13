import forketSerializeProps from "forket/lib/utils/serializeProps.js";
import React from "react";
import Header from "./Header.js";
import LoginForm from "./LoginForm.js";
import { login, logout } from "../server-actions/auth.js";
import { COOKIES } from "../constants.js";
import DB from '../db.js';
import ImagesManager from "./ImagesManager.js";
import Expandable from "./Expandable.js";
export const AFf_7 = async ({ data: [id] })=>{
    "use server";
    await DB.deleteImage(id);
};
export const AFf_6 = async ({ data: [username] })=>{
    "use server";
    return await DB.getImagesByUsername(username);
};
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
        <HeaderBoundary username={username} logout={"$FSA_f_25_logout"}/>
        {!username && (<section className="container mxauto">
            <LoginFormBoundary login={"$FSA_f_26_login"}/>
          </section>)}
        {username && (<section className="container mxauto">
            <ImagesManagerBoundary username={username} getImages={"$FSA_f_23_AFf_6"} deleteImage={"$FSA_f_24_AFf_7"} initialImages={images}/>
          </section>)}
        <section className="container mxauto">
          <div className="loading-box mt2 pt1">
            <ExpandableBoundary label="What's this?">
              <p>This is an experimental app that exercises the implementation of React Server Components.</p>
            </ExpandableBoundary>
          </div>
        </section>
        <script src="/bundle.js"></script>
      </body>
    </html>);
}
function HeaderBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Header", "f_27"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_27" data-c="Header">
          {children}
        </template>)}
      <template type="forket/start/f_27" data-c="Header"></template>
      <Header {...props} children={children}/>
      <template type="forket/end/f_27" data-c="Header"></template>
      <script id="forket/init/f_27" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_27", "Header", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "LoginForm", "f_28"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_28" data-c="LoginForm">
          {children}
        </template>)}
      <template type="forket/start/f_28" data-c="LoginForm"></template>
      <LoginForm {...props} children={children}/>
      <template type="forket/end/f_28" data-c="LoginForm"></template>
      <script id="forket/init/f_28" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_28", "LoginForm", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
function ImagesManagerBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "ImagesManager", "f_29"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_29" data-c="ImagesManager">
          {children}
        </template>)}
      <template type="forket/start/f_29" data-c="ImagesManager"></template>
      <ImagesManager {...props} children={children}/>
      <template type="forket/end/f_29" data-c="ImagesManager"></template>
      <script id="forket/init/f_29" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_29", "ImagesManager", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
function ExpandableBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "Expandable", "f_30"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="f_30" data-c="Expandable">
          {children}
        </template>)}
      <template type="forket/start/f_30" data-c="Expandable"></template>
      <Expandable {...props} children={children}/>
      <template type="forket/end/f_30" data-c="Expandable"></template>
      <script id="forket/init/f_30" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "f_30", "Expandable", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
