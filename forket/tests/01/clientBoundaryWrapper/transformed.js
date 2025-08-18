function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["FORKETID111", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["FORKETID111", "LoginForm", ${JSON.stringify(serializedProps)}]);
        })();`
    }}></script>
      {children && children.length > 0 && (<template type="forket/children" id="FORKETID111" data-c="LoginForm">
          {children}
        </template>)}
      <template type="forket/start" id="FORKETID111" data-c="LoginForm"></template>
      <LoginForm {...props} children={children}/>
      <template type="forket/end" id="FORKETID111" data-c="LoginForm"></template>
    </>);
}
