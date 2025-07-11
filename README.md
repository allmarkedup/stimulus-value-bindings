# Stimulus value bindings

_One-way reactive DOM bindings for Stimulus JS_ 

## About

`stimulus-value-bindings` helps you drastically reduce the amount of boring _something-has-changed-and-now-the-DOM-needs-updating_ code in your Stimulus JS controllers.

It allows you to declaratively bind element attributes and content to [values](https://stimulus.hotwired.dev/reference/values) defined in your controllers. Any changes to the values will **automatically be reflected in the associated DOM elements**.

## Example usage

Add the `useValueBindings` mixin to the `connect` method in your Stimulus controller and define one or more `value` properties in [the usual way](https://stimulus.hotwired.dev/reference/values):


```js
// read-more-controller.js
import { Controller } from "@hotwired/stimulus";
import { useValueBindings } from "stimulus-value-bindings";

export default class extends Controller {
  static values = {
    showMore: Boolean,
    buttonText: String
  }

  connect(){
    useValueBindings(this);
  }

  toggle(){
    this.openValue = !this.openValue;
    this.buttonTextValue = this.openValue ? "Read less" : "Read more";
  }
}
```

Element attributes as well as text and HTML content can then be declaratively bound to your controller values using special `binding` data attributes. These take the following format:

```
data-[identifier]-bind-[bindingType]="exampleValue"
```

For example:

```html
<div data-controller="read-more">
  <p>This is the summary content.</p>

  <button data-action="read-more#toggle" data-read-more-bind-text="buttonTextValue">Read more</button>

  <p data-read-more-bind-hidden="!showMore" data-read-more-bind-aria-expanded="showMore" hidden>
    This is the extended content.
  </p>
</div>
```

## Binding types

The `bindingType` part of the binding data attribute format (`data-[identifier]-bind-[bindingType]="exampleValue"`) can be one of the following:

### `text`

Updates the `textContent` of the bound element whenever the value is changed.

```html
<h1 data-example-bind-text="titleValue"></h1>
```

### `html`

Updates the `innerHTML` of the bound element whenever the value is changed.

```html
<div data-example-bind-html="contentValue"></div>
```

### `[attribute-name]`

Updates the value of the `attribute-name` attribute when the value is changed.

```html
<img data-example-bind-src="imgUrlValue"> // sync the img element `src` attribute value with the `imgUrl` value
<div data-example-bind-hidden="hiddenValue"></div> // add/remove the `hidden` attribute when the `hidden` value is changed
<img data-example-bind-data-theme="currentThemeValue"> // sync the `data-theme` attribute value with the `currentTheme` value
```



