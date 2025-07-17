import { bind } from "./bind";
import { walk } from "./utils";
import { resolveValue } from "./value-resolver";

const bindingAttrMatcher = "bind-?([\\w-]*)(?::([\\w:-]+))?";

export function registerBindings(controller) {
  if (!bindingsAreInitialized(controller)) {
    controller.__value_bindings = new Set();
    registerBindingsForNode(controller, controller.element);
  }
}

export function updateBindings(controller, callback) {
  const bindings = getBindings(controller);

  bindings.forEach((binding) => {
    const { node } = binding;
    if (!controller.element.contains(node)) {
      // clean up any bindings for elements that have been removed from the DOM
      bindings.delete(binding);
    } else {
      updateBindingsForNode(controller, binding);
      node.removeAttribute("data-cloak");
    }
  });

  if (typeof callback === "function") {
    // Run the callback once all bindings have been updated.
    callback();
  }
}

function updateBindingsForNode(controller, binding) {
  const { node, type, lookup, modifiers } = binding;
  const value = resolveValue(controller, lookup, modifiers, [node]);
  bind(node, type, value);
}

export function registerBindingsForNode(controller, rootNode) {
  walk(rootNode, (node) => {
    Array.from(node.attributes)
      .filter((attr) => skipAttr(controller.identifier, attr))
      .forEach((attr) => {
        const params = getBindingParamsFromAttribute(attr);
        registerBinding(controller, { node, ...params });
        node.removeAttribute(attr.name);
      });
  });
}

export function refreshBindings(controller) {
  clearBindings(controller);
  registerBindings(controller);
}

export function registerBinding(controller, binding) {
  getBindings(controller).add(binding);
}

export function deregisterBindingsForNode(controller, node) {
  const bindings = getBindings(controller);

  bindings.forEach((binding) => {
    if (binding.node === node) {
      bindings.delete(binding);
    }
  });
}

export function clearBindings(controller) {
  controller.__value_bindings?.clear();
  controller.__value_bindings = new Set();
}

export function getBindings(controller) {
  return controller.__value_bindings;
}

function bindingsAreInitialized(controller) {
  return controller.__value_bindings instanceof Set;
}

function bindingAttrRegex(identifier = null) {
  const prefix = identifier ? `data-${identifier}` : "data-(?:[\\w-]+)";
  return new RegExp(`^${prefix}-${bindingAttrMatcher}$`, "ig");
}

function getBindingParamsFromAttribute(attr) {
  const matcher = bindingAttrRegex();
  let [_, type, modifiers = ""] = [...attr.name.matchAll(matcher)][0];
  type = type || "all";
  modifiers = modifiers.split(":");
  return { type, modifiers, lookup: attr.value };
}

function skipAttr(identifier, attr) {
  return bindingAttrRegex(identifier).test(attr.name);
}
