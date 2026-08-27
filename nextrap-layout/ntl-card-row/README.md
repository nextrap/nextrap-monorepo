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
  @include cardRow.default-style();
}
```

Content-Pane example:

```markdown
## Cards
{: layout="ntl-card-row" section-style="--cols: 4;"}

### Card 1
{: layout="nte-card"}

### Card 2
{: layout="nte-card" section-style="--cols: 6;"}

### Card 3
{: layout="nte-card"}
```

The row follows Bootstrap's 12-column model. `--cols: 4` makes every card four columns wide; an individual card can override the inherited row value with its own `--cols`. Fixed columns neither grow nor shrink, and overflowing card content is clipped. Without `--cols`, a card uses the full available row width.

`--min-width` and `--max-width` optionally constrain cards and both default to `unset`.

```markdown
## Cards
{: layout="ntl-card-row" section-style="--min-width: 18rem; --max-width: 32rem"}

### Card 1
{: layout="nte-card"}

### Card 2
{: layout="nte-card"}

### Card 3
{: layout="nte-card"}
```

## Migrations

| Old | New |
| --- | --- |
| `--default-cols: 4` | `--cols: 4` on the row |
| `class="with-min-width"` | Remove; set `--min-width` directly if needed |

See `.ai-usage-info.md` and `demo/base.md` for implementation hints and examples.
