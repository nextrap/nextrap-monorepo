# nte-input

This library was generated with [Nx](https://nx.dev).

It provides form primitives for Nextrap projects:

- `nte-input-control`: styling wrapper that provides label/error/hint/layout and ships the input CSS.
- `nte-input`: logic/validation wrapper for native inputs; use it inside `nte-input-control` for styling.
- `nte-input-tags`: tag/autocomplete input.
- `nte-input-signature`: canvas-based signature capture.
- `nte-input-group`: layout helper for responsive form grids.

## Usage

```html
<!-- Default: inline label + control (control is the default slot) -->
<nte-input-control label="Email">
    <nte-input type="email" name="email" placeholder="name@example.com" required></nte-input>
</nte-input-control>

<!-- Native inputs also work (still default slot) -->
<nte-input-control label="Native">
    <input class="form-control" name="native" placeholder="Plain input" />
</nte-input-control>

<!-- Multiline layout (label above) via CSS class -->
<nte-input-control class="multiline" label="Comment">
    <nte-input type="textarea" name="comment" rows="3"></nte-input>
</nte-input-control>

<!-- Width tuning (12-col grid) -->
<nte-input-control style="--nxa-label-cols: var(--cols-3); --nxa-input-cols: var(--cols-9)" label="Wider input">
    <nte-input type="text" name="wide"></nte-input>
</nte-input-control>

<!-- Size + modern styling via CSS classes -->
<nte-input-control class="size-sm style-modern" label="Small modern">
    <nte-input type="text" name="smallModern"></nte-input>
</nte-input-control>

<!-- Floating label uses the `floating` property (layout/cols do not apply); give a placeholder -->
<nte-input-control floating label="Username">
    <nte-input type="text" name="username" placeholder=" "></nte-input>
</nte-input-control>

<!-- Custom label content -->
<nte-input-control>
    <span slot="label">Email <small>(work)</small></span>
    <nte-input type="email" name="email" required></nte-input>
</nte-input-control>
```

## Building

Run `nx build nte-input` to build the library.

## Running unit tests

Run `nx test nte-input` to execute the unit tests via [Vitest](https://vitest.dev/).

## Developing

Run `nx serve nte-input` to serve the `index.html` for development.
