# stimulus-value-bindings

_One-way reactive DOM bindings for [Stimulus JS](https://stimulus.hotwired.dev)._ 

## Overview

`stimulus-value-bindings` helps you drastically reduce the amount of boring _something-has-changed-and-now-the-DOM-needs-updating_ code in your Stimulus JS controllers.

It allows you to declaratively bind element attributes and content to [Stimulus controller values](https://stimulus.hotwired.dev/reference/values). When a value is changed (via the [setter methods](https://stimulus.hotwired.dev/reference/values#setters) or when the associated data attribute value is changed) any bound DOM elements will **automatically be updated** to reflect the new value.

> [!NOTE]
> This documentation is very bare-bones at the moment! More detailed information coming soon.

## Simple counter example

```js
// counter-controller.js
import { Controller } from "@hotwired/stimulus";
import { useValueBindings } from "stimulus-value-bindings";

export default class extends Controller {
  static values = {
    count: Number
  }

  connect(){
    useValueBindings(this);
  }

  increment(){
    this.countValue++;
  }

  decrement(){
    this.countValue--;
  }
}
```

```html
<div data-controller="counter">
  <span id="count" data-counter-bind-text="countValue">0</span>

  <button data-action="counter#increment">+</button>
  <button data-action="counter#decrement">-</button>
</div>
```

When the `+` or `-` buttons are clicked the `span#count` element text content will be automatically be updated to reflect the current value of the `count` controller value. The counter display is kept in sync with the `count` value without needing to manually update the DOM after each change.

## Usage

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
    this.buttonTextValue = this.openValue ? "read less" : "read more";
  }
}
```

Element attributes as well as text and HTML content can then be declaratively bound to your controller values using [special `binding` data attributes](#binding-attributes).

```html
<div data-controller="read-more">
  <p>This is the summary content.</p>

  <button data-action="read-more#toggle" data-read-more-bind-text="buttonTextValue">read more</button>

  <p data-read-more-bind-hidden="!showMore" data-read-more-bind-aria-expanded="showMore" hidden>
    This is the additional content.
  </p>
</div>
```

In the example above, clicking the `read more` button will toggle the `hidden` attribute on the 'additional content' `div` to hide or show it. The button text will additonally be updated to `read more` or `read less` according to whether the additional content is currently hidden or shown respectively. 

## Binding attributes

Binding attributes take the following format:

```
data-[identifier]-bind-[bindingType]="[propertyName]"
```

* `[identifier]`: The [controller identifier](https://stimulus.hotwired.dev/reference/controllers#identifiers)
* `[bindingType]`: See the [binding types](#binding-types) docs below.
* `[propertyName]` The controller value getter property to bind to

### Binding types

The following types of bindings are available:

#### `text`

Updates the `textContent` of the bound element whenever the value is changed.

```html
<h1 data-example-bind-text="titleValue"></h1>
```

#### `html`

Updates the `innerHTML` of the bound element whenever the value is changed.

```html
<article data-example-bind-html="articleTextValue"></article>
```

#### `[attribute-name]`

Updates the value of the `attribute-name` attribute when the value is changed.

```html
<img data-example-bind-src="imgUrlValue"> // sync the img element `src` attribute value with the `imgUrl` value
<div data-example-bind-hidden="hiddenValue"></div> // add/remove the `hidden` attribute when the `hidden` value is changed
<img data-example-bind-data-theme="currentThemeValue"> // sync the `data-theme` attribute value with the `currentTheme` value
```


