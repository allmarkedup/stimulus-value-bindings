# stimulus-value-bindings

_Reactive DOM bindings for [Stimulus JS](https://stimulus.hotwired.dev)._ 

## Overview

`stimulus-value-bindings` lets you bind element attributes and content in the DOM to Stimulus [controller values](https://stimulus.hotwired.dev/reference/values).

Bindings are **reactive** - every time a value is changed any bound attributes or contents in the DOM are automatically (and transparently) updated to reflect the value changes.

Bindings are **one-way** - the flow of updates is always from the controller to the DOM. Direct manipulation to bound attributes in the DOM will not result in the controller values being updated.

`stimulus-value-bindings` can help you drastically reduce the amount of boring _something-has-changed-and-now-the-DOM-needs-updating_ code in your Stimulus JS controllers.

> [!NOTE]
> This documentation is a work-in-progress at the moment... keep checking back for updates.

## Simple counter example

The example below is a simple 'counter' example that should help to demonstrate how reactive value bindings work.

▶️ [View this example running in JSBin](https://jsbin.com/hitotizesi/edit?html,output)

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

Element attributes as well as text content can then be declaratively bound to your controller values using [special `binding` data attributes](#binding-attributes).

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

## Adding bindings to elements

Bindings are declared on DOM elements using data attributes with the following format:

```
data-[identifier]-bind-[bindingType]="[valueName]"
```

* `[identifier]`: The [identifier](https://stimulus.hotwired.dev/reference/controllers#identifiers) of the target controller
* `[bindingType]`: See below for the types of bindings available.
* `[valueName]` The name of the [value getter property](https://stimulus.hotwired.dev/reference/values#properties-and-attributes) to bind to.

### Element `textContent` binding

The `textContent` of elements can be bound to controller values using _text bindings_.

```
data-[identifier]-bind-text="[valueName]"
```

For example:

```js
// defined in example-controller.js
static values = {
  count: Number
}
```

```html
<div data-controller="example">
  <span data-example-bind-text="countValue">0</span>
</div>
```

### Attribute bindings

The values of DOM element attributes can be bound to controller values using _attribute bindings_.

```
data-[identifier]-bind-[attribute-name]="[valueName]"
```

For example:

```js
// defined in example-controller.js
static values = {
  imgUrl: String,
}
```

```html
<div data-controller="example">
  <img data-example-bind-src="imgUrlValue"> 
</div>
```

#### Boolean attributes

Boolean attributes will be added or removed according to the truthiness of the value they are bound to.

```js
// defined in example-controller.js
static values = {
  hidden: Boolean,
}
```

```html
<div data-controller="example">
  <div data-example-bind-hidden="hiddenValue">some content</div> 
</div>
```

* When `hiddenValue` is `true`, the `hidden` attribute will be added to the bound element.
* When `hiddenValue` is `false`, the `hidden` attribute will be removed from the element.


