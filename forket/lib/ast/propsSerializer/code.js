function serialize$Props(props) {
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
    return props.map(serialize$Props);
  }
  if (isValidElement(props)) {
    return false; // Do not serialize React elements
  }

  const serialized = {};
  for (const key in props) {
    const value = props[key];
    if (typeof value === "function") {
      continue;
    }
    const serializedProp = serialize$Props(value);
    if (serializedProp !== false) {
      serialized[key] = serialize$Props(value);
    }
  }

  return serialized;
}