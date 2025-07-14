import { Controller } from "@hotwired/stimulus";
import { useValueBindings } from "../../dist/main";

export default class extends Controller {
  static targets = ["count", "rating", "up"];
  static values = {
    count: {
      type: Number,
      default: 0,
    },
  };
  connect() {
    useValueBindings(this);
  }
  increment() {
    this.countValue++;
  }
  get rating() {
    let rating = "";
    for (let i = 0; i < this.countValue; i++) rating += "⭐️";
    return rating;
  }
}
