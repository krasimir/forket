function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "LoginForm", "FORKETID111"));
    const children = props.children;
    return (<>
      {children && (<template type="forket/children" id="FORKETID111" data-c="LoginForm">
          {children}
        </template>)}
      <template type="forket/start/FORKETID111" data-c="LoginForm"></template>
      <LoginForm {...props} children={children}/>
      <template type="forket/end/FORKETID111" data-c="LoginForm"></template>
      <script id="forket/init/FORKETID111" dangerouslySetInnerHTML={{
        __html: `$F_booter(document.currentScript, "FORKETID111", "LoginForm", ${JSON.stringify(serializedProps)});`
    }}></script>
    </>);
}
