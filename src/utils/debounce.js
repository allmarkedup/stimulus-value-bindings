export function debounce(func, wait) {
  var timeout;

  return function () {
    const context = this,
      args = arguments;

    const later = function () {
      timeout = null;
      func.apply(context, args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
