import TestController from "../support/test-controller";

export default class extends TestController {
  static values = {
    count: {
      type: Number,
      default: 0,
    },
  };

  increment() {
    this.countValue++;
  }

  get rating() {
    let rating = "";
    for (let i = 0; i < this.countValue; i++) rating += "⭐️";
    return rating;
  }
}
