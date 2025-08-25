function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props, "LoginForm", "FORKETID111"));
    const children = props.children;
    return (<>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          let a = ["FORKETID111", "LoginForm", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
    }}></script>
      {children && (<template type="forket/children" id="FORKETID111" data-c="LoginForm">
          {children}
        </template>)}
      <template type="forket/start" id="FORKETID111" data-c="LoginForm"></template>
      <LoginForm {...props} children={children}/>
      <template type="forket/end" id="FORKETID111" data-c="LoginForm"></template>
    </>);
}
