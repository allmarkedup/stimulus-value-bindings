let flushPending = false;
let flushing = false;
let queue = [];
let lastFlushedIndex = -1;

export function queueJob(job) {
  if (!queue.includes(job)) queue.push(job);
  queueFlush();
}

function queueFlush() {
  if (!flushing && !flushPending) {
    flushPending = true;
    queueMicrotask(flushJobs);
  }
}

export function flushJobs() {
  flushPending = false;
  flushing = true;

  for (let i = 0; i < queue.length; i++) {
    queue[i]();
    lastFlushedIndex = i;
  }

  queue.length = 0;
  lastFlushedIndex = -1;
  flushing = false;
}
