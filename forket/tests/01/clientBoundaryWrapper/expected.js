function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <script type="forket/props" id="FORKETID111" dangerouslySetInnerHTML={{
        __html: serializedProps
    }}></script>
      <template type="forket/children" id="FORKETID111">
        {children}
      </template>
      <template type="forket/start" id="FORKETID111"></template>
      <LoginForm {...props} children={children}/>
      <template type="forket/end" id="FORKETID111"></template>
      <script dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["FORKETID111", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["FORKETID111", "LoginForm"]);
        })();`
    }}></script>
    </>);
}
