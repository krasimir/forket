function ProductsListBoundary(props) {
  const serializedProps = serialize$Props(props);
  return (
    <>
      <boundary_f_1>
        <ProductsList {...props} />
      </boundary_f_1>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function () {
  if (typeof $FRSC !== 'undefined') return $FRSC(["f_1", "ProductsList", ${serializedProps}]);
  if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
  $FRSC_.push(["f_1", "ProductsList", ${serializedProps}]);
})();`
        }}
      />
    </>
  );
}
