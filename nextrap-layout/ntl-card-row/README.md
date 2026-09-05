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

ntl-card-row.timeline {
  @include cardRow.with-horizontal-flow(
    $visible-cols-mobile: 1.25,
    $gap: 1rem,
    $snap: proximity
  );
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

Opt-in mobile horizontal flow with a visible preview of the next card:

```markdown
## Milestones
{: layout="ntl-card-row.with-horizontal-flow" section-style="--cols: 3; --visible-cols-mobile: 1.2; --horizontal-flow-gap: 16px;"}

### Discover

Define the shared goal.

### Prototype

Test the first solution.

### Deliver

Ship and measure the result.
```

The row follows Bootstrap's 12-column model. `--cols: 4` makes every card four columns wide; an individual card can override the inherited row value with its own `--cols`. Fixed columns neither grow nor shrink, and overflowing card content is clipped. Without `--cols`, a card uses the full available row width. Mobile mode remains a full-width single column unless `.with-horizontal-flow` is present. The modifier creates a native horizontal scroller only in mobile mode; desktop keeps the 12-column layout.

`--min-width` and `--max-width` optionally constrain cards and both default to `unset`.

For `.with-horizontal-flow`, `--visible-cols-mobile` controls how many cards are visible (default `1.15`), `--horizontal-flow-gap` controls their inline gap, and `--horizontal-flow-snap` accepts `none`, `proximity` or `mandatory` (default `proximity`). Values below `1` for `--visible-cols-mobile` are clamped to `1` by the sizing rule.

When setting `--gutter-x` or `--gutter-y`, always use real length values with units such as `0px`, `16px` or `24px`. Never use unitless `0`, because gutter values are used in `calc()` expressions.

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
