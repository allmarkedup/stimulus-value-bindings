let stack = [];

export function nextTick(callback = () => {}) {
  queueMicrotask(() => {
    setTimeout(() => releaseNextTicks());
  });

  return new Promise((res) => {
    stack.push(() => {
      callback();
      res();
    });
  });
}

function releaseNextTicks() {
  while (stack.length) stack.shift()();
}
