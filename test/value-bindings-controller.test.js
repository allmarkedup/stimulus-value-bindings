import { TestContext } from "./support/test-context";
import { waitFor } from "@testing-library/dom";
import { ValueBindingsController } from "../src";

const context = new TestContext(
  class extends ValueBindingsController {
    static values = {
      count: Number,
    };
  }
);

afterEach(() => context.teardown());

describe("ValueBindingsController", () => {
  it("Is value bindings enabled", async () => {
    const { controller, elements } = await context.setup(`
      <div data-controller="subject">
        <span data-subject-bind-text="countValue" data-test-element="count"></span>
      </div>
    `);

    expect(typeof controller.updateBindings).toBe("function");
    expect(elements.count.textContent).toBe("0");

    controller.countValue = 999;
    waitFor(() => {
      expect(elements.count.textContent).toBe("999");
    });
  });
});
