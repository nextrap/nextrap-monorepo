# ntl-card

Card layout web component with optional header, image, content, footer and link handling.

## Usage

```ts
import '@nextrap/ntl-card';
```

```html
<ntl-card class="default">
  <h3 slot="header">Card title</h3>
  <img slot="image" src="/image.jpg" alt="">
  <p>Card content</p>
  <p slot="footer">Footer</p>
</ntl-card>
```

## Styling

```scss
@use '@nextrap/ntl-card' as card;

ntl-card {
  @include card.default-style();
}
```

`default-style()` sets border, background, border radius, inner padding and image aspect-ratio variables. It does not set a wrapper gap.

Available mixins:

```scss
@include card.default-style();
@include card.with-image-fullsize();
@include card.with-image-overlay();
@include card.with-modifier-classes();
```

Use `--aspect-ratio` or `--image-aspect-ratio` on `ntl-card` to control the image area ratio.
