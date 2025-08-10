export default function serializeProps(props) {
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
    return props.map(serializeProps);
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
    const serializedProp = serializeProps(value);
    if (serializedProp !== false) {
      serialized[key] = serializeProps(value);
    }
  }

  return serialized;
}
