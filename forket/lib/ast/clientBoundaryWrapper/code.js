function ComponentName(props) {
  const serializedProps = JSON.stringify(forketSerializeProps(props, "ProductsList", "f_1"));
  const children = props.children;
  return (
    <>
      {children && (
        <template type="forket/children" id="f_1" data-c="ProductsList">
          {children}
        </template>
      )}
      <template type="forket/start/f_1" data-c="ProductsList"></template>
      <ProductsList {...props} children={children} />
      <template type="forket/end/f_1" data-c="ProductsList"></template>
      <script
        id="forket/init/f_1"
        dangerouslySetInnerHTML={{
          __html: `$F_booter(document.currentScript, "f_1", "ProductsList", ${JSON.stringify(serializedProps)});`
        }}
      ></script>
    </>
  );
}
