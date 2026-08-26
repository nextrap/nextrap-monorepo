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

Content-Pane example:

```markdown
## Cards
{: layout="ntl-card-row" cols="4"}

### Card 1
{: layout="nte-card"}

### Card 2
{: layout="nte-card" cols="6"}

### Card 3
{: layout="nte-card"}
```

`cols` accepts an integer and defaults to `6` (or the legacy `--default-cols` CSS custom property). A `cols` attribute on a child overrides the row value for that item.

For intrinsic wrapping, set `min-width`. Cards then wrap when their minimum width can no longer be maintained and grow to fill the available row. `max-width` optionally caps their growth and defaults to `unset`.

```markdown
## Cards
{: layout="ntl-card-row" min-width="18rem" max-width="32rem"}

### Card 1
{: layout="nte-card"}

### Card 2
{: layout="nte-card"}

### Card 3
{: layout="nte-card"}
```

The sizing attributes are resolved CSS-only via typed `attr()`.

## Migrations

### `--default-cols` / `--cols` to `cols`

Previously, the row default was configured through `--default-cols`, while an individual card used `--cols` to override its width:

```markdown
## Cards
{: layout="ntl-card-row" style="--default-cols: 4"}

### Card 1
{: layout="nte-card"}

### Card 2
{: layout="nte-card" style="--cols: 6"}

### Card 3
{: layout="nte-card"}
```

Use the `cols` attribute on both the row and an individual card instead:

```markdown
## Cards
{: layout="ntl-card-row" cols="4"}

### Card 1
{: layout="nte-card"}

### Card 2
{: layout="nte-card" cols="6"}

### Card 3
{: layout="nte-card"}
```

The meaning remains Bootstrap-like: `cols="4"` occupies 4 of 12 columns. The row value is the default for its cards; a card's own `cols` value overrides it.

The legacy `--default-cols` custom property remains available as a fallback during migration.

See `.ai-usage-info.md` and `demo/base.md` for implementation hints and examples.
