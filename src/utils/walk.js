export function walk(el, callback) {
  let skip = false;
  callback(el, () => (skip = true));
  if (skip) return;

  let node = el.firstElementChild;
  while (node) {
    walk(node, callback, false);
    node = node.nextElementSibling;
  }
}
