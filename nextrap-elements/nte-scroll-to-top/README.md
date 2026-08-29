# nte-scroll-to-top

An accessible custom element that reveals a fixed button after the document passes a configurable scroll threshold.

```html
<nte-scroll-to-top threshold="300" aria-label="Back to top"></nte-scroll-to-top>
```

`SetDefaultStyleMixin` adds `style-default` when no other `style-*` class is present. Apply the visual baseline from
SCSS while StyleBase provides the design tokens:

```scss
@use '@nextrap/nte-scroll-to-top' as scroll-to-top;

nte-scroll-to-top.style-default {
  @include scroll-to-top.default-style();
}
```

Use `scroll-behavior="auto"` to disable smooth scrolling, `slot="icon"` for a custom icon, and the `button` / `icon`
parts for theme customization.
