function ComponentName(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return (
    <>
      <script type="forket/props" id="f_1" dangerouslySetInnerHTML={{ __html: serializedProps }}></script>
      <template type="forket/children" id="f_1">
        {children}
      </template>
      <template type="forket/start" id="f_1"></template>
      <ProductsList {...props} children={children} />
      <template type="forket/end" id="f_1"></template>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_1", "ProductsList"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_1", "ProductsList"]);
        })();`
        }}
      ></script>
    </>
  );
}
