export function observeTree(controller, callback) {
  let observing = false;
  const { element } = controller;
  const filterElementNodes = (nodes) => Array.from(nodes).filter((node) => node.nodeType !== 3);

  const onMutate = (mutationList) => {
    const removedNodes = [];
    const addedNodes = [];

    mutationList.forEach((mutation) => {
      if (mutation.type === "childList") {
        removedNodes.push(...filterElementNodes(mutation.removedNodes));
        addedNodes.push(...filterElementNodes(mutation.addedNodes));
      }
    });
    if (addedNodes.length || removedNodes.length) {
      callback(addedNodes, removedNodes);
    }
  };

  const observer = new MutationObserver(onMutate);

  return {
    start() {
      if (!observing) {
        observer.observe(element, { childList: true, subtree: true });
        observing = true;
      }
    },
    stop() {
      if (observing) {
        const mutations = observer.takeRecords();
        if (mutations.length > 0) onMutate(mutations);
        observer.disconnect();
        observing = false;
      }
    },
    runWithoutObservation(callback) {
      this.stop();
      callback();
      this.start();
    },
  };
}
