import { Application } from "@hotwired/stimulus";

export class TestContext {
  #application = null;
  #controllerClass = null;

  constructor(...args) {
    if (args.length === 2) {
      [this.identifier, this.#controllerClass] = args;
    } else {
      this.identifier = "subject";
      this.#controllerClass = args[0];
    }
  }

  async setup(html) {
    this.teardown();
    this.#application = Application.start();
    this.#application.register(this.identifier, this.#controllerClass);
    return this.setHTML(html);
  }

  teardown() {
    this.#application?.stop();
    document.body.innerHTML = "";
  }

  async setHTML(htmlString) {
    document.body.innerHTML = htmlString;
    return this;
  }

  get controller() {
    const element = document.body.firstElementChild;
    return this.#application.getControllerForElementAndIdentifier(element, this.identifier);
  }

  get elements() {
    const testElements = {};
    Array.from(document.querySelectorAll("[data-test-element]")).forEach((el) => {
      testElements[el.getAttribute("data-test-element")] = el;
    });
    return testElements;
  }
}
