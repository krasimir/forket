function ComponentName(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return (
    <>
      <boundary_children_f_1>{children}</boundary_children_f_1>
      <boundary_f_1>
        <ProductsList {...props} children={children} />
      </boundary_f_1>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function () {
  const serializedProps = ${serializedProps};
  if (typeof $FRSC !== 'undefined') return $FRSC(["f_1", "ProductsList", serializedProps]);
  if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
  $FRSC_.push(["f_1", "ProductsList", serializedProps]);
})();`
        }}
      />
    </>
  );
}
