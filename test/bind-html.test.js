import { TestContext } from "./support/test-context";
import { waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import TestController from "./support/test-controller";

const context = new TestContext(
  class extends TestController {
    static values = {
      state: {
        type: String,
        default: "default",
      },
    };

    get htmlContent() {
      switch (this.stateValue) {
        case "loading":
          return `
            <div data-test-element="loader">
              <h1>loading...</h1>
            </div>
          `;
          break;

        default:
          return `
            <div data-test-element="default">
              <h1>default content</h1>
            </div>
          `;
          break;
      }
    }

    startLoading() {
      this.stateValue = "loading";
    }
  }
);

afterEach(() => context.teardown());

describe("default value", () => {
  it("sets the initial HTML content of bound elements", async () => {
    const { elements } = await context.setup(`
      <div data-controller="subject">
        <div data-subject-bind-html="htmlContent" data-test-element="output"></div>
      </div>
    `);

    expect(elements.output).toContainElement(elements.default);
    expect(elements.output).toContainElement(elements.default.querySelector("h1"));
  });
});

describe("value updates", () => {
  it("updates the inner HTML when changed within a controller", async () => {
    let { elements } = await context.setup(`
      <div data-controller="subject">
        <div data-subject-bind-html="htmlContent" data-test-element="output"></div>
        <button data-action="click->subject#startLoading" data-test-element="button">start loading</button>
      </div>
    `);

    const user = userEvent.setup();
    await user.click(elements.button);

    expect(context.elements.output).toContainElement(context.elements.loader);
    expect(context.elements.output).toContainElement(context.elements.loader.querySelector("h1"));
  });
});
