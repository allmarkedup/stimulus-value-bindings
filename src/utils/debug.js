const tag = "use-value-bindings";

export function warn(message, ...args) {
  log("warn", message, ...args);
}

export function debug(message, ...args) {
  log("debug", message, ...args);
}

function log(level, message, ...args) {
  if (process.env.NODE_ENV === "test") return;

  console[level](
    `%c${tag}%c ${message}`,
    "background-color: RebeccaPurple; color: white;",
    "color: yellow;",
    ...args
  );
}
