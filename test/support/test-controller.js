import { Controller } from "@hotwired/stimulus";
import { useValueBindings } from "stimulus-value-bindings";

export default class TestController extends Controller {
  connect() {
    useValueBindings(this);
  }
}
