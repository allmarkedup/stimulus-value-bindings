import { TestContext } from "./support/test-context";
import { waitFor } from "@testing-library/dom";
import TestController from "./support/test-controller";

const THEME_CLASSES = {
  primary: "bg-blue-50 border-blue-500",
  error: "bg-red-50 border-red-500",
};

const context = new TestContext(
  class extends TestController {
    static values = {
      theme: {
        type: String,
        default: "primary",
      },
    };

    get themeClassesAsString() {
      switch (this.themeValue) {
        case "primary":
          return THEME_CLASSES.primary;
          break;
        case "error":
          return THEME_CLASSES.error;
          break;

        default:
          return "";
          break;
      }
    }

    get themeClassesAsArray() {
      switch (this.themeValue) {
        case "primary":
          return THEME_CLASSES.primary.split(" ");
          break;
        case "error":
          return THEME_CLASSES.error.split(" ");
          break;

        default:
          return [];
          break;
      }
    }

    get themeClassesAsObject() {
      return {
        [THEME_CLASSES.primary]: this.themeValue === "primary",
        [THEME_CLASSES.error]: this.themeValue === "error",
        "font-sans": true,
      };
    }
  }
);

afterEach(() => context.teardown());

describe("binding to class strings", () => {
  it("evaluates the object properties to build the class list", async () => {
    const { controller, subject } = await context.setup(`
      <div data-controller="subject" data-subject-bind-class="themeClassesAsString">
        <p>This is a themed component</p>
      </div>
    `);

    expect(subject).toHaveClass(THEME_CLASSES.primary, { exact: true });

    controller.themeValue = "error";

    await waitFor(() => {
      expect(subject).toHaveClass(THEME_CLASSES.error, { exact: true });
    });
  });

  it("merges with existing classes", async () => {
    const { controller, subject } = await context.setup(`
      <div data-controller="subject" data-subject-bind-class="themeClassesAsString" class="text-xl text-gray-900">
        <p>This is a themed component</p>
      </div>
    `);

    expect(subject).toHaveClass(THEME_CLASSES.primary, "text-xl text-gray-900", {
      exact: true,
    });

    controller.themeValue = "error";

    await waitFor(() => {
      expect(subject).toHaveClass(THEME_CLASSES.error, "text-xl text-gray-900", {
        exact: true,
      });
    });

    controller.themeValue = "unknown";

    await waitFor(() => {
      expect(subject).toHaveClass("text-xl text-gray-900", {
        exact: true,
      });
    });
  });
});

describe("binding to class arrays", () => {
  it("builds the class list from the classes in the array", async () => {
    const { controller, subject } = await context.setup(`
      <div data-controller="subject" data-subject-bind-class="themeClassesAsArray">
        <p>This is a themed component</p>
      </div>
    `);

    expect(subject).toHaveClass(THEME_CLASSES.primary, { exact: true });

    controller.themeValue = "error";

    await waitFor(() => {
      expect(subject).toHaveClass(THEME_CLASSES.error, { exact: true });
    });
  });

  it("merges with existing classes", async () => {
    const { controller, subject } = await context.setup(`
      <div data-controller="subject" data-subject-bind-class="themeClassesAsArray" class="text-xl text-gray-900">
        <p>This is a themed component</p>
      </div>
    `);

    expect(subject).toHaveClass(THEME_CLASSES.primary, "text-xl text-gray-900", {
      exact: true,
    });

    controller.themeValue = "error";

    await waitFor(() => {
      expect(subject).toHaveClass(THEME_CLASSES.error, "text-xl text-gray-900", {
        exact: true,
      });
    });

    controller.themeValue = "unknown";

    await waitFor(() => {
      expect(subject).toHaveClass("text-xl text-gray-900", {
        exact: true,
      });
    });
  });
});

describe("binding to class objects", () => {
  it("evaluates the object properties to build the class list", async () => {
    const { controller, subject } = await context.setup(`
      <div data-controller="subject" data-subject-bind-class="themeClassesAsObject">
        <p>This is a themed component</p>
      </div>
    `);

    expect(subject).toHaveClass(THEME_CLASSES.primary, "font-sans", { exact: true });

    controller.themeValue = "error";

    await waitFor(() => {
      expect(subject).toHaveClass(THEME_CLASSES.error, "font-sans", { exact: true });
    });
  });

  it("merges with existing classes", async () => {
    const { controller, subject } = await context.setup(`
      <div data-controller="subject" data-subject-bind-class="themeClassesAsObject" class="text-xl text-gray-900">
        <p>This is a themed component</p>
      </div>
    `);

    expect(subject).toHaveClass(THEME_CLASSES.primary, "text-xl text-gray-900 font-sans", {
      exact: true,
    });

    controller.themeValue = "error";

    await waitFor(() => {
      expect(subject).toHaveClass(THEME_CLASSES.error, "text-xl text-gray-900 font-sans", {
        exact: true,
      });
    });

    controller.themeValue = "unknown";

    await waitFor(() => {
      expect(subject).toHaveClass("text-xl text-gray-900 font-sans", {
        exact: true,
      });
    });
  });
});
