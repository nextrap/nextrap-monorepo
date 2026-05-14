# nte-spinner

Animated spinner web component with support for loading, progress, success, error, info and warning states.

## Installation

```bash
npm install @nextrap/nte-spinner
```

## Usage

```html
<nte-spinner style="width: 200px"></nte-spinner>
<nte-spinner class="progress" style="width: 200px; --percentage: 30; --percentage-txt: '30%';"></nte-spinner>
<nte-spinner class="checked" style="width: 200px"></nte-spinner>
<nte-spinner class="cross" style="width: 200px"></nte-spinner>
<nte-spinner class="info" style="width: 200px"></nte-spinner>
<nte-spinner class="warning" style="width: 200px"></nte-spinner>
```

## State classes

| Class | Description |
|---|---|
| `progress` | Shows a fixed progress ring using `--percentage` and `--percentage-txt` |
| `checked` | Shows a success state with animated check mark |
| `cross` | Shows an error state with animated cross |
| `info` | Shows an info state with `?` |
| `warning` | Shows a warning state with `!` |

## CSS Custom Properties

| Variable | Default | Description |
|---|---|---|
| `--delta` | `50` | Spinner dash offset for the loading animation |
| `--percentage` | `1` | Progress value from `0` to `100` |
| `--percentage-txt` | `"1%"` | Label for progress mode |
| `--playtime` | `1250ms` | Base animation duration |
| `--color-loader` | `#6a6a6a` | Default loading color |
| `--color-checked` | `#55c900` | Success color |
| `--color-progress` | `#509dde` | Progress color |
| `--color-cross` | `#df2f2f` | Error color |
| `--color-info` | `#2196f3` | Info color |
| `--color-warning` | `#ff9800` | Warning color |

## Example

```html
<nte-spinner class="progress" style="width: 160px; --percentage: 72; --percentage-txt: '72%';"></nte-spinner>
```
