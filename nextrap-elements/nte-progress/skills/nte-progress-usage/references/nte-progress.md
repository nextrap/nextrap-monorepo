# `<nte-progress>` reference

Import `@nextrap/nte-progress`, then use `<nte-progress>` for determinate progress whose current value and range are known. Use `nte-spinner` for indeterminate waiting without a measurable completion value.

```html
<nte-progress value="40" min="0" max="100"></nte-progress>
```

## Public API

| Attribute / property | Type | Default | Purpose |
|---|---|---:|---|
| `value` | `number` | `0` | Current value, constrained to the configured range. |
| `min` | `number` | `0` | Lower range boundary. |
| `max` | `number` | `100` | Upper range boundary. |
| `steps` | `number` | `0` | Rounds values to discrete intervals when greater than zero. |
| `type` | `'bar' \| 'circle'` | `'bar'` | Selects the visual representation. |
| `striped` | `boolean` | `false` | Adds stripes to the bar representation. |
| `animated` | `boolean` | `false` | Animates stripes when `striped` is also active. |

Circle content is supplied through the default slot. The bar uses the native `<progress>` element in its shadow tree.

## Events

| Event | Detail | When |
|---|---|---|
| `progress-changed` | `{ value }` | The effective value changes. |
| `step-changed` | `{ stepIndex }` | A stepped value moves to another step. |
| `completed` | `{ value }` | The value reaches `max`. |

All three events bubble and cross the shadow boundary.

## Naming

`nte-progress` is intentionally retained. “Progress” accurately covers both its bar and circle representations, follows the concise Nextrap element naming convention, and avoids a breaking rename to the more verbose `nte-progress-indicator` without adding a distinct responsibility.
