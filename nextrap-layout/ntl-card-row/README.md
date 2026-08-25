# ntl-card-row

Responsive row layout for `nte-card` components.

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
  <nte-card>Card 1</nte-card>
  <nte-card class="highlight" style="--cols: 6">Card 2</nte-card>
  <nte-card>Card 3</nte-card>
</ntl-card-row>
```

See `.ai-usage-info.md` and `demo/base.md` for implementation hints and examples.
