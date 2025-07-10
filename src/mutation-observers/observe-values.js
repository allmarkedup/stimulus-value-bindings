export function observeValues(controller, callback) {
  const values = controller.constructor.values || {};

  let observing = false;

  const changeCallbacks = Object.keys(values).map((key) => {
    const callbackName = `${key}ValueChanged`;
    const controllerCallback = controller[callbackName];
    const monkeyPatchedCallback = function (value, previousValue) {
      if (observing) {
        callback(key, value, previousValue, this);
      }
      if (typeof controllerCallback === "function") {
        controllerCallback.call(this, value, previousValue);
      }
    };
    return [callbackName, monkeyPatchedCallback.bind(controller)];
  });

  Object.assign(controller, Object.fromEntries(changeCallbacks));

  return {
    start() {
      observing = true;
    },
    stop() {
      observing = false;
    },
  };
}
