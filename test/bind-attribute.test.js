import { TestContext } from "./support/test-context";
import { waitFor } from "@testing-library/dom";
import TestController from "./support/test-controller";

describe("element attributes", () => {
  const context = new TestContext(
    class extends TestController {
      static values = {
        src: String,
        alt: {
          type: String,
          default: "No description available",
        },
      };

      connect() {
        super.connect();

        this.nullValue = null;
        this.falseValue = false;
        this.undefinedValue = undefined;
      }
    }
  );

  afterEach(() => context.teardown());

  it("binds default values", async () => {
    const { elements } = await context.setup(`
      <div data-controller="subject" data-subject-src-value="https://example.com/example.gif">
        <img data-subject-bind-src="srcValue" data-subject-bind-alt="altValue" data-test-element="image">
      </div>
    `);

    expect(elements.image).toHaveAttribute("src", "https://example.com/example.gif");
    expect(elements.image).toHaveAttribute("alt", "No description available");
  });

  it("keeps the attribute values in sync with the controller values", async () => {
    const { controller, elements } = await context.setup(`
      <div data-controller="subject">
        <img data-subject-bind-src="srcValue" data-subject-bind-alt="altValue" data-test-element="image">
      </div>
    `);

    controller.srcValue = "/cute-kittens.png";
    controller.altValue = "A picture of cute kittens";

    await waitFor(() => {
      expect(elements.image).toHaveAttribute("src", controller.srcValue);
      expect(elements.image).toHaveAttribute("alt", controller.altValue);
    });

    controller.srcValue = "loading.gif";
    controller.altValue = "Loading...";

    await waitFor(() => {
      expect(elements.image).toHaveAttribute("src", controller.srcValue);
      expect(elements.image).toHaveAttribute("alt", controller.altValue);
    });
  });

  it("removes attributes with falsey values", async () => {
    const { elements } = await context.setup(`
      <div data-controller="subject">
        <img data-subject-bind-src="nullValue" data-test-element="img1">
        <img data-subject-bind-src="falseValue" data-test-element="img2">
        <img data-subject-bind-src="undefinedValue" data-test-element="img3">
      </im>
    `);

    expect(elements.img1).not.toHaveAttribute("src");
    expect(elements.img2).not.toHaveAttribute("src");
    expect(elements.img3).not.toHaveAttribute("src");
  });
});

describe("boolean attributes with associated properties", () => {
  const context = new TestContext(
    class extends TestController {
      static values = {
        disabled: Boolean,
        checked: {
          type: Boolean,
          default: true,
        },
      };
    }
  );

  afterEach(() => context.teardown());

  it("binds default values", async () => {
    const { elements } = await context.setup(`
      <div data-controller="subject">
        <input data-subject-bind-disabled="disabledValue" type="text" data-test-element="input1">
        <input data-subject-bind-checked="checkedValue" type="checkbox" data-test-element="input2">
      </div>
    `);

    expect(elements.input1.disabled).toBe(false);
    expect(elements.input1).not.toHaveAttribute("disabled");

    expect(elements.input2.checked).toBe(true);
    expect(elements.input2).toHaveAttribute("checked");
  });

  it("adds the attribute when the value changes to true", async () => {
    const { controller, elements } = await context.setup(`
      <div data-controller="subject">
        <input data-subject-bind-disabled="disabledValue" type="text" data-test-element="input">
      </div>
    `);

    expect(elements.input.disabled).toBe(false);
    expect(elements.input).not.toHaveAttribute("disabled");

    controller.disabledValue = true;

    await waitFor(() => {
      expect(elements.input.disabled).toBe(true);
      expect(elements.input).toHaveAttribute("disabled");
    });
  });

  it("removed the attribute when the value changes to false", async () => {
    const { controller, elements } = await context.setup(`
      <div data-controller="subject">
        <input data-subject-bind-checked="checkedValue" type="checkbox" data-test-element="input">
      </div>
    `);

    expect(elements.input.checked).toBe(true);
    expect(elements.input).toHaveAttribute("checked");

    controller.checkedValue = false;

    await waitFor(() => {
      expect(elements.input.checked).toBe(false);
      expect(elements.input).not.toHaveAttribute("checked");
    });
  });
});
