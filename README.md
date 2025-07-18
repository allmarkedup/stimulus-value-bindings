<center>

<img src=".github/assets/svb.png" alt="stimulus-value-bindings" width="440"> 

_⚡️ Reactive DOM bindings for [Stimulus JS](https://stimulus.hotwired.dev). ⚡️_

![NPM Version](https://img.shields.io/npm/v/stimulus-value-bindings)
 [![CI](https://github.com/allmarkedup/stimulus-value-bindings/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/allmarkedup/stimulus-value-bindings/actions/workflows/ci.yml)

</center>

---

## Overview
 
`stimulus-value-bindings` allows DOM element attribute values to be _reactively_ bound to Stimulus [controller values](https://stimulus.hotwired.dev/reference/values)
so that the DOM attributes are automatically updated when their bound value property changes.

Bindings are: 

* **reactive** - every time a value is changed any bound attributes (or text contents) in the DOM are automatically (and transparently) updated to reflect the changes.
* **one-way** - the flow of updates is always from the controller to the DOM. Direct manipulation to bound attributes in the DOM will not result in the controller values being updated.

`stimulus-value-bindings` can help you drastically reduce the amount of boring _something-has-changed-and-now-the-DOM-needs-updating_ code in your Stimulus JS controllers.

> [!WARNING]
> This documentation is a work-in-progress! Please open an issue if you are having problems.

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

## Installation

Add the `stimulus-value-bindings` package to your `package.json`:

#### Using NPM:

```
npm i stimulus-value-bindings --save
```

#### Using Yarn:

```
yarn add stimulus-value-bindings
```

## Usage

The `stimulus-value-bindings` package exports a `useValueBinding` function that can be used to add reactive value binding functionality to controllers.

```js
import { Controller } from "@hotwired/stimulus";
import { useValueBindings } from "stimulus-value-bindings";

export default class extends Controller {
  connect(){
    useValueBindings(this);
  }
}
```

Alternatively, the package also exports a 'ready to go' `ValueBindingsController` base controller if you prefer extension over composition for your classes:


```js
import { ValueBindingsController } from "stimulus-value-bindings";

export default class extends ValueBindingsController {
  // ...
}
```

You can then specify [controller values](https://stimulus.hotwired.dev/reference/values) in the usual way. These will be watched for changes to trigger any required DOM updates.

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

Now you can bind your DOM element attribute values (or text content) to your controller values using [binding data attributes](#adding-bindings-to-elements).

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
data-[identifier]-bind-[bindingType]="[property]"
```

* `[identifier]`: The [identifier](https://stimulus.hotwired.dev/reference/controllers#identifiers) of the target controller.
* `[bindingType]`: The type of binding required. See below for details.
* `[property]` The bound property specifier.

### Property specifiers



### Binding attributes

The values of DOM element attributes can be bound to controller values using _attribute bindings_.

```
data-[identifier]-bind-[attribute-name]="[property]"
```

For example:

```js
class ExampleController extends Controller {
   static values = {
    progress: Number
  }
  // ...
}
```

```html
<div data-controller="example">
  <h4>Uploading...</h4> 
  <progress data-example-bind-value="progressValue" max="100"></progress>
</div>
```

#### Boolean attributes

Boolean attributes will be added or removed according to the truthiness of the value they are bound to.

```js
class ExampleController extends Controller {
   static values = {
    hidden: Boolean,
  }
  // ...
}
```

```html
<div data-controller="example">
  <div data-example-bind-hidden="hiddenValue">some content</div> 
</div>
```

* When `hiddenValue` is `true`, the `hidden` attribute will be added to the bound element.
* When `hiddenValue` is `false`, the `hidden` attribute will be removed from the element.

### Binding classes

You can dynamically add and remove classes on elements using _class bindings_.

```
data-[identifier]-bind-class="[valueName]"
```

The bound value should evaluate to one of the following:

* a string of classes - i.e. `"class1 class2 class2"`
* an array of classes - i.e.`["class1", "class2", "class2"]`
* a class object - i.e. `{ "class1 class2 class3": true, "class4": false }`

Any existing classes applied using the standard `class` attribute will be preserved across changes to the bound class value property.

#### Array value example

```js
class ExampleController extends Controller {
   static values = {
    titleClasses: {
      type: Array,
      default: ["text-lg", "font-bold"]
    }
  }
  // ...
}
```

```html
<div data-controller="example">
  <h1 data-example-bind-class="titleClassesValue">This is the title</h1>
</div>
```

The `h1` element will initially be rendered with the default classes applied:

```html
<h1 class="text-lg font-bold">This is the title</h1>
```

If another class is added to the `titleClasses` value, the `h1` will automatically be updated to include the new class:

```js
this.titleClassesValue.push("text-red-600");
```

```html
<h1 class="text-lg font-bold text-red-600">This is the title</h1>
```

#### Class object example

```js
class ExampleController extends Controller {
   static values = {
    theme: {
      type: String,
      default: "primary"
    }
  },

  get themeClasses(){
    return {
      "bg-blue-50 border-blue-500": this.themeValue === "primary",
      "bg-red-50 border-red-500": this.themeValue === "error",
      "font-sans": true,
    };
  }
  // ...
}
```

```html
<div data-controller="example">
  <h1 data-example-bind-class="themeClasses" class="text-lg">This is the title</h1>
</div>
```

```html
<!-- `this.themeValue = "default";` -->
<h1 class="bg-red-50 border-red-500 text-lg">This is the title</h1>
```

```html
<!-- `this.themeValue = "error";` -->
<h1 class="bg-red-50 border-red-500 text-lg">This is the title</h1>
```



### Binding text content

The `textContent` of elements can be bound to controller values using _text bindings_.

```
data-[identifier]-bind-text="[property]"
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

### Binding elements to objects

Elements can be bound to `Object`-type values. An attribute or content binding will be created for each of the object's properties.

```
data-[identifier]-bind="[property]"
```

For example:

```js
// defined in example-controller.js
static values = {
  input: {
    type: Object,
    default: {
      value: "default value",
      disabled: true
    }
  }
}
```

```html
<div data-controller="example">
  <input data-example-bind="inputValue">
  <!-- renders: <input disabled="disabled" value="default value"> -->
</div>
```

## Credits

`stimulus-value-bindings` is inspired by (and borrows code from!) the [`x-bind`](https://alpinejs.dev/directives/bind) functionality in Alpine JS.

## License

`stimulus-value-bindings` is available as open source under the terms of the MIT License.