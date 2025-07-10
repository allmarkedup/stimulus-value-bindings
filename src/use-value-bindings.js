import { queueJob } from "./scheduler";
import { observeValues, observeTree } from "./mutation-observers";
import {
  registerBindings,
  updateBindings,
  clearBindings,
  registerBindingsForNode,
  deregisterBindingsForNode,
} from "./bindings";

export const useValueBindings = (controller) => {
  let initialUpdateHasRun = false;

  const updateBindingsAndNotify = () => {
    updateBindings(controller, () => {
      if (typeof controller.bindingsUpdated === "function") {
        controller.bindingsUpdated(!initialUpdateHasRun);
      }
    });
    initialUpdateHasRun = true;
  };

  const scheduleUpdate = () => queueJob(updateBindingsAndNotify);

  const valuesObserver = observeValues(controller, scheduleUpdate);
  const treeObserver = observeTree(controller, (addedNodes, removedNodes) => {
    removedNodes.forEach((node) => deregisterBindingsForNode(controller, node));
    addedNodes.forEach((node) => registerBindingsForNode(controller, node));
    treeObserver.runWithoutObservation(updateBindingsAndNotify);
  });

  registerBindings(controller);
  scheduleUpdate();

  const disconnect = controller.disconnect;
  Object.assign(controller, {
    updateBindings: scheduleUpdate,

    disconnect() {
      valuesObserver.stop();
      treeObserver.stop();
      clearBindings(controller);

      if (typeof disconnect === "function") {
        disconnect.bind(controller)();
      }
    },
  });

  treeObserver.start();
  valuesObserver.start();
};
