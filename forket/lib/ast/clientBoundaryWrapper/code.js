function ComponentName(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "ProductsList", "f_1"));
  const children = props.children;
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function () {
          let a = ["f_1", "ProductsList", ${JSON.stringify(serializedProps)}];
          if (typeof $FRSC !== 'undefined') return $FRSC(a);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(a);
          let me = document.currentScript;
          if (me) me.remove();
        })();`
        }}
      ></script>
      {children && (
        <template type="forket/children" id="f_1" data-c="ProductsList">
          {children}
        </template>
      )}
      <template type="forket/start" id="f_1" data-c="ProductsList"></template>
      <ProductsList {...props} children={children} />
      <template type="forket/end" id="f_1" data-c="ProductsList"></template>
    </>
  );
}
