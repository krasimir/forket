function ProductsListBoundary(props) {
  const serializedProps = forketSerializeProps(props);
  return (
    <>
      <boundary_f_1>
        <ProductsList {...props} />
      </boundary_f_1>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function () {
  if (typeof $FRSC !== 'undefined') return $FRSC(["f_1", ${serializedProps}]);
  if (typeof $FRSC_ === 'undefined') { $FRSC_ = []; }
  $FRSC_.push(["f_1", ${serializedProps}]);
})();`
        }}
      />
    </>
  );
}
function forketSerializeProps(props) {
  return JSON.stringify(props);
}