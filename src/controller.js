import { Controller } from "@hotwired/stimulus";
import { useValueBindings } from "./use-value-bindings";

export default class ValueBindingsController extends Controller {
  connect() {
    useValueBindings(this);
  }
}
