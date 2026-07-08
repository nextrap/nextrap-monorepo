# ntl-card-row

Responsive row layout for `ntl-card` components.

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
<ntl-card-row class="default" style="--default-cols: 3">
  <h2 slot="header">Cards</h2>
  <ntl-card>Card 1</ntl-card>
  <ntl-card class="highlight" style="--cols: 6">Card 2</ntl-card>
  <ntl-card>Card 3</ntl-card>
</ntl-card-row>
```

See `.ai-usage-info.md` and `demo/base.md` for implementation hints and examples.
