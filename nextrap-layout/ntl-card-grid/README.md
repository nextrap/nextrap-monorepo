# ntl-card-grid

Responsive CSS Grid layout for cards.

## Usage

Use `columns` for an explicit number of equal-width grid columns. It defaults to `3`. The legacy `--cols`, `--cols-tablet`, and `--cols-mobile` custom properties remain available as fallbacks.

```html
<ntl-card-grid columns="3" columns-tablet="2" columns-mobile="1">
  <nte-card>Card 1</nte-card>
  <nte-card>Card 2</nte-card>
  <nte-card>Card 3</nte-card>
</ntl-card-grid>
```

For intrinsic wrapping, set `min-width`. The grid then uses `auto-fit` and `minmax()` so items wrap when the minimum width can no longer be maintained and the remaining items stretch across the available width.

```html
<ntl-card-grid min-width="18rem">
  <nte-card>Card 1</nte-card>
  <nte-card>Card 2</nte-card>
  <nte-card>Card 3</nte-card>
</ntl-card-grid>
```

`max-width` optionally caps the width of each card and defaults to `unset`.

```html
<ntl-card-grid min-width="18rem" max-width="32rem">
  ...
</ntl-card-grid>
```

All sizing attributes are resolved CSS-only via typed `attr()`.
