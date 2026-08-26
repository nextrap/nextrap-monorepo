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

## Re-exports

For convenience, `@nextrap/nt-core` re-exports the public APIs from `@trunkjs/browser-utils`, `lit`, and `lit/decorators.js` in addition to the Nextrap core helpers.
