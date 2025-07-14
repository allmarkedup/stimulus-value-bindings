import { Application } from "@hotwired/stimulus";

export class TestContext {
  #application = null;
  #controllerClass = null;

  constructor(identifier, Controller) {
    this.identifier = identifier;
    this.#controllerClass = Controller;
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
}
