import { TestContext } from "./support/test-context";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import CounterController from "./fixtures/counter-controller";

const context = new TestContext("counter", CounterController);

afterEach(() => context.teardown());

describe("default values", () => {
  it("sets the initial text content of bound elements", async () => {
    const { controller } = await context.setup(`
      <div data-controller="counter">
        <span data-counter-target="count" data-counter-bind-text="countValue"></span>
        <span data-counter-target="rating" data-counter-bind-text="rating"></span>
      </div>
    `);

    expect(controller.countTarget.textContent).toBe("0");
    expect(controller.ratingTarget).toBeEmptyDOMElement();
  });

  it("respects default values set via data attributes", async () => {
    const { controller } = await context.setup(`
      <div data-controller="counter" data-counter-count-value="5">
        <span data-counter-target="count" data-counter-bind-text="countValue"></span>
        <span data-counter-target="rating" data-counter-bind-text="rating"></span>
      </div>
    `);

    expect(controller.countTarget.textContent).toBe("5");
    expect(controller.ratingTarget.textContent).toBe("⭐️⭐️⭐️⭐️⭐️");
  });
});

describe("value updates", () => {
  it("updates the text content when changed within a controller", async () => {
    const { controller } = await context.setup(`
      <div data-controller="counter">
        <span data-counter-target="count" data-counter-bind-text="countValue"></span>
        <button data-action="click->counter#increment" data-counter-target="up">+</button>
      </div>
    `);

    const user = userEvent.setup();
    const { countTarget, upTarget } = controller;

    expect(countTarget.textContent).toBe("0");

    await user.click(upTarget);
    expect(countTarget.textContent).toBe("1");

    await user.click(upTarget);
    expect(countTarget.textContent).toBe("2");
  });

  it("updates the text content when the controller value setter method is called directly", async () => {
    const { controller } = await context.setup(`
      <div data-controller="counter">
        <span data-counter-target="count" data-counter-bind-text="countValue"></span>
      </div>
    `);
    const { countTarget } = controller;

    expect(countTarget.textContent).toBe("0");

    controller.countValue = 1;
    await waitFor(() => {
      expect(countTarget.textContent).toBe("1");
    });

    controller.countValue = 123;
    await waitFor(() => {
      expect(countTarget.textContent).toBe("123");
    });
  });

  it("updates the text content when value attributes change", async () => {
    const { controller } = await context.setup(`
      <div data-controller="counter">
        <span data-counter-target="count" data-counter-bind-text="countValue"></span>
      </div>
    `);
    const { countTarget, element } = controller;

    element.setAttribute("data-counter-count-value", "20");
    await waitFor(() => {
      expect(countTarget.textContent).toBe("20");
    });

    element.setAttribute("data-counter-count-value", "456");
    await waitFor(() => {
      expect(countTarget.textContent).toBe("456");
    });
  });
});
