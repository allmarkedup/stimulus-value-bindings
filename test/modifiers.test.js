import { TestContext } from "./support/test-context";
import { waitFor } from "@testing-library/dom";
import TestController from "./support/test-controller";

describe("value modifiers", () => {
  const context = new TestContext(
    class extends TestController {
      static values = {
        shown: Boolean,
      };
    }
  );

  afterEach(() => context.teardown());

  it(":not modifier", async () => {
    const { controller, elements } = await context.setup(`
      <div data-controller="subject">
        <img data-subject-bind-hidden:not="shown" data-test-element="toggle">
      </div>
    `);
    expect(controller.shownValue).toBe(false);
    expect(elements.toggle).toHaveAttribute("hidden");

    controller.shownValue = true;

    await waitFor(() => {
      expect(elements.toggle).not.toHaveAttribute("hidden");
    });
  });
});
