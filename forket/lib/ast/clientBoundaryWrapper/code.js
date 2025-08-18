function ComponentName(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_1", "ProductsList"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_1", "ProductsList", ${JSON.stringify(serializedProps)}]);
        })();`
        }}
      ></script>
      {children && children.length > 0 && (
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
