function forketSerializeProps(props) {
  function isValidElement(obj) {
    const keys = Object.keys(obj);
    return (
      typeof obj === "object" &&
      obj !== null &&
      keys.includes("_owner") &&
      keys.includes("_store") &&
      keys.includes("props")
    );
  }
  if (props == null || typeof props !== "object") return props;

  if (Array.isArray(props)) {
    return props.map(forketSerializeProps);
  }
  if (isValidElement(props)) {
    return false; // Do not serialize React elements
  }

  const serialized = {};
  for (const key in props) {
    const value = props[key];
    if (typeof value === "function") {
      serialized[key] = "$FRSC_function";
      continue;
    }
    const serializedProp = forketSerializeProps(value);
    if (serializedProp !== false) {
      serialized[key] = forketSerializeProps(value);
    }
  }

  return serialized;
}