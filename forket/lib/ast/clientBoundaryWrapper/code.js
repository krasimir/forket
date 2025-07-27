function ComponentName(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props));
  const children = props.children || [];
  return (
    <>
      <boundary_children_f_1>{children}</boundary_children_f_1>
      <boundary_props_f_1 dangerouslySetInnerHTML={{ __html: serializedProps  }} />
      <boundary_setup_f_1
        dangerouslySetInnerHTML={{
          __html: `(function () {
          if (typeof $FRSC !== 'undefined') return $FRSC(["f_1", "ProductsList"]);
          if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
          $FRSC_.push(["f_1", "ProductsList"]);
        })();`
        }}
      />
      <boundary_f_1>
        <ProductsList {...props} children={children} />
      </boundary_f_1>
    </>
  );
}
