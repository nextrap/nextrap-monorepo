# ntl-card-grid

Responsive CSS Grid layout for cards.

## Usage

Use `--cols` for an explicit number of equal-width grid columns. It defaults to `3`. Tablet and mobile counts use `--cols-tablet` and `--cols-mobile`.

```markdown
## Cards
{: layout="ntl-card-grid" style="--cols: 3; --cols-tablet: 2; --cols-mobile: 1"}

### Card 1
{: layout="nte-card"}

### Card 2
{: layout="nte-card"}

### Card 3
{: layout="nte-card"}
```

For intrinsic wrapping, set `--min-width` and add `with-min-width`. The grid then uses `auto-fit` and `minmax()` so items wrap when the minimum width can no longer be maintained and the remaining items stretch across the available width. `--max-width` optionally caps card width and defaults to `unset`.

```markdown
## Cards
{: layout="ntl-card-grid" class="with-min-width" style="--min-width: 18rem; --max-width: 32rem"}

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
| `columns="3"` | `style="--cols: 3"` |
| `columns-tablet="2"` | `style="--cols-tablet: 2"` |
| `columns-mobile="1"` | `style="--cols-mobile: 1"` |
| `min-width="18rem"` | `class="with-min-width" style="--min-width: 18rem"` |
| `max-width="32rem"` | `style="--max-width: 32rem"` |

`--cols` intentionally means the number of CSS Grid tracks. This differs from the Bootstrap-like 12-column sizing of `ntl-card-row`.
