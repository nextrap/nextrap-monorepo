# Nextrap Core

`@nextrap/nt-core` is the shared base package for all Nextrap 2.x web components. Element and layout components now use the same core factory and feature model.

## Define an element

```ts
import { nextrap_element } from '@nextrap/nt-core';

export class CustomElement extends nextrap_element({
  logging: true,
  eventBinding: true,
}) {}
```

## Features

Features are enabled through the options passed to `nextrap_element()`:

- `logging` — logging helpers from TrunkJS browser utilities.
- `slotVisibility` — slot visibility handling.
- `eventBinding` — event bindings used by `@Listen` decorators.
- `breakpoints` — responsive breakpoint behavior.
- `setDefaultStyle` — default-style support; enabled by default.
- `subLayoutApply` — nested layout application for components that transform slotted layout content.

## Layout elements

Layout components use the same core factory as all other Nextrap elements:

```ts
import { nextrap_element } from '@nextrap/nt-core';

export class CustomLayout extends nextrap_element({
  subLayoutApply: true,
}) {}
```

Nextrap 2.x has one component factory: `nextrap_element()`.

## Generate a complete component

`generate_component()` is the object-based alternative for small and medium components that do
not need a handwritten class. It still creates a real subclass of `LitElement`, uses
`nextrap_element()` as its base, and can register and return the finished custom-element
constructor.

The first argument owns class-level settings such as the tag name, Nextrap features, and functional
Shadow DOM styles. The second argument describes the typed instance API and behavior.

### Minimal slot component

```ts
import { css, generate_component, html } from '@nextrap/nt-core';

export const NteSlotPanel = generate_component(
  {
    tagName: 'nte-slot-panel',
    slots: ['header'],
    features: { slotVisibility: true },
    styles: css`
      :host { display: block; }
      [part='content'] { min-width: 0; }
    `,
  },
  {
    $template() {
      return html`
        <header part="header"><slot name="header"></slot></header>
        <div part="content"><slot></slot></div>
      `;
    },
  },
);
```

No decorators, lifecycle overrides, or explicit `customElements.define()` call are needed. The
normal `nextrap_element()` defaults, including `LoaderMixin`, logging, and default-style handling,
remain active.

### Attributes, state, callbacks, methods, and events

```ts
import { css, generate_component, html } from '@nextrap/nt-core';

export const NteCounter = generate_component(
  {
    tagName: 'nte-generated-counter',
    slots: ['actions'],
    styles: css`:host { display: inline-block; }`,
  },
  {
    $options: {
      prefix: 'Count', // constructor-only and readonly in the public type
    },
    $attributes: {
      count: { type: Number, initial: 0, reflect: true },
      label: { type: String, initial: 'Clicks', attribute: 'label' },
      values: {
        initial: [] as string[],
        parse: (value) => value?.split(',').map((entry) => entry.trim()) ?? [],
      },
    },
    $state: {
      rendered: false, // reactive, but absent from the returned public instance type
    },
    $fn: {
      increment() {
        this.count += 1;
      },
      onWindowResize() {
        this.requestUpdate();
      },
      incrementTwice() {
        this.$call('increment');
        this.$call('increment');
      },
    },
    $methods: {
      reset(value = 0) {
        this.count = value;
      },
    },
    $events: [
      { type: 'resize', target: 'window', handler: 'onWindowResize', options: { passive: true } },
    ],
    $lifecycle: {
      connected() {
        // The generated class already called every parent connectedCallback.
        this.log('counter connected');
      },
      firstRender() {
        this.rendered = true;
      },
      updated(changedProperties) {
        if (changedProperties.has('count')) {
          this.dispatchEvent(new CustomEvent('count-change', { detail: this.count }));
        }
      },
    },
    $template({ $attributes, $state, $fn }) {
      return html`
        <button @click=${$fn.increment}>
          ${this.prefix}: ${$attributes.label} ${$attributes.count}
        </button>
        <small ?hidden=${!$state.rendered}>ready</small>
        <slot></slot>
        <slot name="actions"></slot>
      `;
    },
  },
);
```

Callbacks and public methods must use method syntax rather than arrow functions when they access
`this`. They are invoked with the component instance as `this`. An internal callback can call
another internal callback through the typed `this.$call(...)`; `$call` and `$fn` do not appear on
the public constructor result.

The configured lifecycle names currently are `connected`, `disconnected`, `adopted`,
`attributeChanged`, `shouldUpdate`, `willUpdate`, `firstRender`, and `updated`. The generator keeps
the native/Lit parent call order and removes configured listeners when the component disconnects.
Event targets are `host`, `renderRoot`, `window`, and `document`.

### Programmatic construction and slots

Providing `tagName` registers the class by default, so the returned value can be constructed with
`new` and retains completion for options, attributes, public methods, and configured slot names.
Programmatic Light DOM accepts only `HTMLElement` instances—never strings, text nodes, or arbitrary
objects.

```ts
const content = document.createElement('p');
content.textContent = 'Created through the programmatic API';

const badge = document.createElement('strong');
badge.textContent = 'New';

const action = document.createElement('button');
action.textContent = 'Reset';

const counter = new NteCounter(
  {
    prefix: 'Total',
    count: 4,
    $slots: content, // one element for the default slot
  },
  [badge], // an element array for the default slot
  { actions: action }, // a typed object map for named slots
);

counter.reset();
document.body.append(counter);
```

HTML construction remains unchanged:

```html
<nte-generated-counter count="4" label="Requests" values="one, two">
  Created through the HTML API
  <button slot="actions">Reset</button>
</nte-generated-counter>
```

The available object-map keys come from `slots` in the first generator argument. In the example,
code completion offers only `actions`. Each map value can be one `HTMLElement` or an array. The
generator assigns the matching `slot` property to every element before appending it to the Light
DOM. Unknown names also throw at runtime.

An actual `Map` is accepted as well:

```ts
const actions = new Map<'actions', HTMLElement>([['actions', action]]);
const counter = new NteCounter({}, actions);
```

Direct elements and arrays retain an already assigned `slot` property; otherwise they belong to the
default slot. The inferred slot names are also available as `NteCounter.slotNames`.

### Type and runtime boundaries

- Attribute keys and values are inferred from `type`, `initial`, and the return type of `parse`.
- Constructor-option keys and public method signatures are inferred from their objects.
- Named programmatic slots are inferred from `slots: ['name', ...]`. Object slot maps accept only
  these names and only `HTMLElement` values or arrays of them.
- State and internal callbacks get full contextual `this` completion but are hidden from the public
  TypeScript instance type. This is API encapsulation, not JavaScript `#private` enforcement.
- The result is a real class value, so `export const MyElement = generate_component(...)` and
  `new MyElement(...)` work. TypeScript cannot generate a new lexical `class` declaration or named
  private fields from runtime object keys.
- `register: false` returns an unregistered constructor for manual registration or subclassing.
  Browsers only permit direct `new` construction after that constructor has been added to a custom
  element registry.
- Templates are typed Lit template callbacks. Free-form HTML strings with `{{...}}` placeholders
  are deliberately not parsed: a string parser cannot safely preserve Lit's distinct text,
  attribute, property, boolean, and event-binding contexts. Lit expressions provide those contexts
  without `unsafeHTML`, runtime expression evaluation, or decorators.

## Re-exports

For convenience, `@nextrap/nt-core` re-exports the public APIs from `@trunkjs/browser-utils`, `lit`, and `lit/decorators.js` in addition to the Nextrap core helpers.
