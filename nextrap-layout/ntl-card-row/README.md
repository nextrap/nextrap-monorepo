# ntl-card-row

Responsive row layout for `nte-card` components. The default layout follows Bootstrap's 12-column model.

## Visual Demo

```bash
nx dev ntl-card-row
```

## Usage

```ts
import '@nextrap/ntl-card-row';
```

```scss
@use '@nextrap/ntl-card-row' as cardRow;

ntl-card-row {
  @include cardRow.default-style($default-cols: 3);
}
```

```html
<ntl-card-row class="default" cols="4">
  <h2 slot="header">Cards</h2>
  <nte-card>Card 1</nte-card>
  <nte-card class="highlight" cols="6">Card 2</nte-card>
  <nte-card>Card 3</nte-card>
</ntl-card-row>
```

`cols` accepts an integer and defaults to `6` (or the legacy `--default-cols` CSS custom property). A `cols` attribute on a child overrides the row value for that item.

For intrinsic wrapping, set `min-width`. Cards then wrap when their minimum width can no longer be maintained and grow to fill the available row. `max-width` optionally caps their growth and defaults to `unset`.

```html
<ntl-card-row min-width="18rem" max-width="32rem">
  <nte-card>Card 1</nte-card>
  <nte-card>Card 2</nte-card>
  <nte-card>Card 3</nte-card>
</ntl-card-row>
```

The sizing attributes are resolved CSS-only via typed `attr()`.

See `.ai-usage-info.md` and `demo/base.md` for implementation hints and examples.
