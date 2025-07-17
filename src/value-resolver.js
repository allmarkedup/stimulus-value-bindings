import { getProperty } from "dot-prop";
import { warn } from "./utils";

export function resolveValue(object, lookup, modifiers, fnArgs = []) {
  let value = getProperty(object, lookup);
  if (typeof value === "undefined") {
    // Try the value getter property
    value = getProperty(object, `${lookup}Value`);
  }
  if (typeof value === "function") {
    // if it's a function then call it to get the value.
    // the node is supplied as the first argument.
    value = value.bind(object)(...fnArgs);
  }
  // apply any modifiers to the resolved value
  if (typeof value === "undefined") {
    warn(`could not resolve value '${lookup}' for object '${object.identifier}'`);
  } else {
    return applyModifiers(value, modifiers);
  }
}

function applyModifiers(value, modifiers = []) {
  for (let i = 0; i < modifiers.length; i++) {
    switch (modifiers[i]) {
      case "not":
        value = applyNotModifier(value);
        break;
      default:
        warn(`unknown modifier '${modifiers[i]}'`);
        break;
    }
  }
  return value;
}

function applyNotModifier(value) {
  return !value;
}
