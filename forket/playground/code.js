function ClientBoundary(id, componentName) {
  return (props) => (
    <>
      <template data-client-component data-id={id} data-component={componentName} data-props={JSON.stringify(props)} />
      <script
        dangerouslySetInnerHTML={{
          __html: `!function(){if("undefined"!=typeof $FRSC)return $FRSC("T:0");"undefined"==typeof $FRSC_&&($FRSC_=[]),$FRSC_.push("T:0")}();`
        }}
      />
    </>
  );
}
