import chalk from "chalk";

export default function serializeProps(props, componentName) {
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
    console.warn(
      chalk.gray(`𐂐 Prop serlizer: React element found in props. It will not be serialized. Used on <${componentName}> component.`)
    );
    return false;
  }

  const serialized = {};
  for (const key in props) {
    const value = props[key];
    if (typeof value === "function") {
      console.warn(
        chalk.gray(`𐂐 Prop serlizer: property "${key}" is a regular function and it will not be serialized. Used on <${componentName}> component. Maybe use "use server" in it?`)
      );
      continue;
    }
    const serializedProp = serializeProps(value);
    if (serializedProp !== false) {
      serialized[key] = serializeProps(value);
    }
  }

  return serialized;
}
