import chalk from "chalk";
import { getRequestContext } from "../server/requestContext.js";

export default function serializeProps(props, componentName, boundaryID) {
  const ctx = getRequestContext();

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
    return props.map((v) => serializeProps(v, componentName, boundaryID));
  }
  if (isValidElement(props)) {
    // console.warn(
    //   chalk.gray(
    //     `𐂐 Prop serlizer: React element found in props. It will not be serialized. Used on <${componentName}> component.`
    //   )
    // );
    return false;
  }

  const serialized = {};
  for (const key in props) {
    const value = props[key];
    if (typeof value === "function") {
      console.warn(
        chalk.gray(
          `𐂐 Prop serlizer: property "${key}" is a regular function and it will not be serialized. Used on <${componentName}> component. Maybe use "use server" in it?`
        )
      );
      continue;
    } else if (isPromise(value)) {
      if (ctx?.getId && ctx?.addTasks) {
        const id = ctx.getId();
        ctx.addTasks(id, value, boundaryID);
        serialized[key] = `$FLP_${id}`;
      }
      continue;
    }
    const serializedProp = serializeProps(value, componentName, boundaryID);
    if (serializedProp !== false) {
      serialized[key] = serializedProp;
    }
  }

  return serialized;
}

function isPromise(obj) {
  return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
