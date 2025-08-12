function LoginFormBoundary(props) {
    const serializedProps = JSON.stringify(forketSerializeProps(props));
    const children = props.children || [];
    return (<>
      <boundary_children_FORKETID111>{children}</boundary_children_FORKETID111>
      <boundary_props_FORKETID111 dangerouslySetInnerHTML={{
        __html: serializedProps
    }}/>
      <boundary_setup_FORKETID111 dangerouslySetInnerHTML={{
        __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["FORKETID111", "LoginForm"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["FORKETID111", "LoginForm"]);
        })();`
    }}/>
      <boundary_FORKETID111>
        <LoginForm {...props} children={children}/>
      </boundary_FORKETID111>
    </>);
}
