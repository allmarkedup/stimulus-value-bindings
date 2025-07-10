import { getProperty } from "dot-prop";
import { bind } from "./bind";
import { walk } from "./utils";

export function updateBindings(controller, callback) {
  const bindings = getBindings(controller);
  bindings.forEach((binding) => {
    const { node, name, path } = binding;
    if (!controller.element.contains(node)) {
      // remove any bindings for elements that have been removed
      bindings.delete(binding);
    } else {
      // Update bindings for the node
      bind(node, name, getProperty(controller, path));
      // Remove the cloaking attribute if present
      node.removeAttribute("data-cloak");
    }
  });

  if (typeof callback === "function") {
    // Run the callback once all bindings have been updated.
    callback();
  }
}

export function registerBindings(controller) {
  if (!bindingsAreInitialized(controller)) {
    controller.__value_bindings = new Set();
    registerBindingsForNode(controller, controller.element);
  }
}

export function registerBindingsForNode(controller, rootNode) {
  const attrPrefix = `data-${controller.identifier}-bind`;

  walk(rootNode, (node) => {
    Array.from(node.attributes)
      .filter(({ name }) => name.startsWith(attrPrefix))
      .forEach((attr) => {
        const path = attr.value;
        const name = attr.name === attrPrefix ? "all" : attr.name.replace(`${attrPrefix}-`, "");
        registerBinding(controller, node, name, path);
        node.removeAttribute(attr.name);
      });
  });
}

export function refreshBindings(controller) {
  clearBindings(controller);
  registerBindings(controller);
}

export function registerBinding(controller, node, name, path) {
  getBindings(controller).add({ node, name, path });
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
