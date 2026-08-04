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
- `data-group-name` (`string`) dispatches the shared Nextrap group open/close event for paired controls like `nte-burger`.

## Methods

```ts
const offcanvas = document.querySelector('nte-offcanvas');
offcanvas?.open();
offcanvas?.close();
offcanvas?.toggle();
```

## Parts

Use `::part(backdrop)`, `::part(offcanvas)`, `::part(header)`, `::part(main)` and `::part(footer)` for theme styling.

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
  $header-padding: var(--nt-space),
  $main-padding: 0,
  $footer-padding: var(--nt-space),
  $main-min-height: 200px,
  $transition-duration: 0.2s
);
```

Keep Shadow DOM styles functional only; visual defaults belong in the package SCSS mixin and are bound to `nte-offcanvas.style-default`.
