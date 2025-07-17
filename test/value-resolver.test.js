import { TestContext } from "./support/test-context";
import { waitFor } from "@testing-library/dom";
import TestController from "./support/test-controller";

const context = new TestContext(
  class extends TestController {
    static values = {
      ready: Boolean,
      greeting: "hello",
    };

    initialize() {
      this.language = "english";
    }

    getGreeting() {
      return this.greetingValue;
    }

    getTagName(node) {
      return node.tagName;
    }

    get extendedGreeting() {
      return this.greetingValue + " world";
    }

    get props() {
      return {
        language: this.language,
        examples: {
          greeting: this.greetingValue,
        },
      };
    }
  }
);

afterEach(() => context.teardown());

describe("stimulus values", () => {
  it("can resolve values without the `Value` getter method prefix", async () => {
    const { controller, elements } = await context.setup(`
      <div data-controller="subject">
        <div data-subject-bind-text="greeting" data-test-element="greeting"></div>
      </div>
    `);

    expect(elements.greeting.textContent).toBe("hello");
  });

  it("can resolve value via the value getter", async () => {
    const { controller, elements } = await context.setup(`
      <div data-controller="subject">
        <div data-subject-bind-text="greetingValue" data-test-element="greeting"></div>
      </div>
    `);

    expect(elements.greeting.textContent).toBe("hello");
  });
});

describe("methods", () => {
  it("can resolve method references", async () => {
    const { elements } = await context.setup(`
      <div data-controller="subject">
        <div data-subject-bind-text="getGreeting" data-test-element="greeting"></div>
      </div>
    `);

    expect(elements.greeting.textContent).toBe("hello");
  });

  it("provides the node as the first argument when resolving method references", async () => {
    const { elements } = await context.setup(`
      <div data-controller="subject">
        <div data-subject-bind-text="getTagName" data-test-element="div"></div>
        <span data-subject-bind-text="getTagName" data-test-element="span"></span>
      </div>
    `);

    expect(elements.div.textContent).toBe("DIV");
    expect(elements.span.textContent).toBe("SPAN");
  });
});
