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
{: layout="ntl-card-row" style="--default-cols: 4"}

### Card 1
{: layout="nte-card"}

### Card 2
{: layout="nte-card" style="--cols: 6"}

### Card 3
{: layout="nte-card"}
```

The row follows Bootstrap's 12-column model. `--default-cols` defines the default card width and defaults to `6`; an individual card can override it with `--cols`.

For intrinsic wrapping, set `--min-width` and add `with-min-width`. Cards then wrap when their minimum width can no longer be maintained and grow to fill the available row. `--max-width` optionally caps their growth and defaults to `unset`.

```markdown
## Cards
{: layout="ntl-card-row" class="with-min-width" style="--min-width: 18rem; --max-width: 32rem"}

### Card 1
{: layout="nte-card"}

### Card 2
{: layout="nte-card"}

### Card 3
{: layout="nte-card"}
```

> Typed `attr()` casting can replace the CSS custom-property configuration once it is supported by Firefox and Safari.

## Migrations

| Old | New |
| --- | --- |
| `cols="4"` | `style="--default-cols: 4"` |
| `cols="6"` on a card | `style="--cols: 6"` on a card |
| `min-width="18rem"` | `class="with-min-width" style="--min-width: 18rem"` |
| `max-width="32rem"` | `style="--max-width: 32rem"` |

See `.ai-usage-info.md` and `demo/base.md` for implementation hints and examples.
