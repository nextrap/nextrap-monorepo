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

## Migrations

### `--cols*` to `columns*`

Previously, the number of grid tracks was configured with the `--cols`, `--cols-tablet`, and `--cols-mobile` CSS custom properties:

```html
<ntl-card-grid
  style="--cols: 3; --cols-tablet: 2; --cols-mobile: 1"
>
  <nte-card>Card 1</nte-card>
  <nte-card>Card 2</nte-card>
  <nte-card>Card 3</nte-card>
</ntl-card-grid>
```

Use the corresponding `columns`, `columns-tablet`, and `columns-mobile` attributes instead:

```html
<ntl-card-grid columns="3" columns-tablet="2" columns-mobile="1">
  <nte-card>Card 1</nte-card>
  <nte-card>Card 2</nte-card>
  <nte-card>Card 3</nte-card>
</ntl-card-grid>
```

`columns` intentionally means the number of CSS Grid tracks. This distinguishes it from the Bootstrap-like `cols` API of `ntl-card-row`, where a value represents a share of the 12-column layout.

The legacy `--cols`, `--cols-tablet`, and `--cols-mobile` custom properties remain available as fallbacks during migration.
