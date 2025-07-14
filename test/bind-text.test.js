import { TestContext } from "./support/test-context";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import TestController from "./support/test-controller";

const context = new TestContext(
  class extends TestController {
    static values = {
      count: Number,
      unit: {
        type: String,
        default: "things",
      },
    };

    increment() {
      this.countValue++;
    }

    changeUnit(event) {
      this.unitValue = event.params.unit;
    }
  }
);

afterEach(() => context.teardown());

describe("default values", () => {
  it("sets the initial text content of bound elements", async () => {
    const { elements } = await context.setup(`
      <div data-controller="subject">
        <span data-subject-bind-text="countValue" data-test-element="count"></span>
        <span data-subject-bind-text="unitValue" data-test-element="unit"></span>
      </div>
    `);

    expect(elements.count.textContent).toBe("0");
    expect(elements.unit.textContent).toBe("things");
  });

  it("respects default values set via data attributes", async () => {
    const { elements } = await context.setup(`
      <div data-controller="subject" data-subject-count-value="5" data-subject-unit-value="items">
        <span data-subject-bind-text="countValue" data-test-element="count"></span>
        <span data-subject-bind-text="unitValue" data-test-element="unit"></span>
      </div>
    `);

    expect(elements.count.textContent).toBe("5");
    expect(elements.unit.textContent).toBe("items");
  });
});

describe("value updates", () => {
  it("updates the text content when changed within a controller", async () => {
    const { elements } = await context.setup(`
      <div data-controller="subject">
        <span data-subject-bind-text="countValue" data-test-element="count"></span>
        <span data-subject-bind-text="unitValue" data-test-element="unit"></span>
        <button data-action="click->subject#increment" data-test-element="incrementer">+</button>
        <button data-action="click->subject#changeUnit" data-subject-unit-param="items" data-test-element="unitChanger">change unit</button>
      </div>
    `);

    const user = userEvent.setup();
    const { count, incrementer } = elements;

    expect(count.textContent).toBe("0");

    await user.click(incrementer);
    expect(count.textContent).toBe("1");

    await user.click(incrementer);
    expect(count.textContent).toBe("2");

    const { unit, unitChanger } = elements;

    expect(unit.textContent).toBe("things");

    await user.click(unitChanger);
    expect(unit.textContent).toBe("items");
  });

  it("updates the text content when the controller value setter method is called directly", async () => {
    const { controller, elements } = await context.setup(`
      <div data-controller="subject">
        <span data-subject-bind-text="countValue" data-test-element="count"></span>
        <span data-subject-bind-text="unitValue" data-test-element="unit"></span>
      </div>
    `);
    const { count, unit } = elements;

    expect(count.textContent).toBe("0");
    expect(unit.textContent).toBe("things");

    controller.countValue = 1;
    await waitFor(() => {
      expect(count.textContent).toBe("1");
    });

    controller.countValue = 123;
    await waitFor(() => {
      expect(count.textContent).toBe("123");
    });

    controller.unitValue = "doodads";
    await waitFor(() => {
      expect(unit.textContent).toBe("doodads");
    });
  });

  it("updates the text content when value attributes change", async () => {
    const { controller, elements } = await context.setup(`
      <div data-controller="subject">
        <span data-subject-bind-text="countValue" data-test-element="count"></span>
        <span data-subject-bind-text="unitValue" data-test-element="unit"></span>
      </div>
    `);
    const { count, unit } = elements;

    controller.element.setAttribute("data-subject-count-value", "20");
    await waitFor(() => {
      expect(count.textContent).toBe("20");
    });

    controller.element.setAttribute("data-subject-count-value", "456");
    await waitFor(() => {
      expect(count.textContent).toBe("456");
    });

    controller.element.setAttribute("data-subject-unit-value", "widgets");
    await waitFor(() => {
      expect(unit.textContent).toBe("widgets");
    });
  });
});
