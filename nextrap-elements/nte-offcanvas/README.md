# @nextrap/nte-offcanvas

Offcanvas web component for slide-in panels with optional backdrop, header, default slot content and footer.

## Import

```ts
import '@nextrap/nte-offcanvas';
```

For styling:

```scss
@use '@nextrap/nte-offcanvas' as offcanvas;
```

## Usage

```html
<button onclick="document.querySelector('#menu').open()">Open</button>

<nte-offcanvas id="menu">
  <div slot="header">
    <strong>Menu</strong>
    <button data-nt-dismiss="offcanvas">Close</button>
  </div>

  <p>Offcanvas content</p>

  <button slot="footer" data-nt-dismiss="offcanvas">Close</button>
</nte-offcanvas>
```

`SetDefaultStyleMixin` adds `style-default` automatically when no other `style-*` class is present.

## Attributes / properties

- `opened` (`boolean`) opens the panel when set.
- `backdrop` (`boolean`, default `true`) toggles the backdrop.
- `open-group` (`string`) makes surfaces in the same named group mutually exclusive across placements and interaction modes. Independently of groups, two modal surfaces at the same effective placement are sequenced: the second waits until the first has closed. Non-modal surfaces at the same placement remain independent.
- `layout-group` (`string`) associates a push surface with matching `nte-offcanvas-pane` elements.
- `data-group-name` is the deprecated alias for `open-group`.

A pane accepts one or more whitespace-separated names in `layout-group`. A pane without a layout group ignores push events:

```html
<nte-offcanvas layout-group="application" style="--nte-offcanvas-mode: push">
  Navigation
</nte-offcanvas>

<nte-offcanvas-pane layout-group="application tools">
  <main>Application content</main>
</nte-offcanvas-pane>
```

## Methods

```ts
const offcanvas = document.querySelector('nte-offcanvas');
offcanvas?.open();
offcanvas?.close();
offcanvas?.toggle();
```

## Slots and parts

The element provides `header`, default, `footer`, and `close` slots. Supplying the `close` slot replaces the built-in accessible close button. The built-in control uses the shared `@nextrap/style-elements` `close-btn()` pattern and `--nt-icon-close`.

Use `::part(offcanvas)`, `::part(dialog)`, `::part(header)`, `::part(main)`, `::part(footer)`, `::part(close)`, and `::part(close-button)` for theme styling. `nte-offcanvas-pane` exposes `::part(pane)`.

## Mixins

```scss
@include offcanvas.default-style(
  $width: 33%,
  $min-width: 250px,
  $max-width: 400px,
  $z-index: 2000,
  $backdrop: rgb(from var(--nt-dark) r g b / 0.5),
  $background-color: var(--nt-primary-subtle),
  $header-background: transparent,
  $shadow-color: rgb(from var(--nt-dark) r g b / 0.5),
  $header-padding: var(--nt-space-4),
  $main-padding: 1rem,
  $footer-padding: var(--nt-space-4),
  $main-min-height: 200px,
  $transition-duration: 0.2s
);
```

Keep Shadow DOM styles functional only; visual defaults belong in the package SCSS mixin and are bound to `nte-offcanvas.style-default`.
