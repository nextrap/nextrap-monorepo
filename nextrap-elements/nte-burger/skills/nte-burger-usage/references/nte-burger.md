# `<nte-burger>`

Import `@nextrap/nte-burger`, then provide a meaningful `text` and the ID of the controlled navigation through `aria-controls`.

```html
<nte-burger text="Toggle main navigation" aria-controls="main-navigation"></nte-burger>
<nav id="main-navigation" hidden>...</nav>
```

## API

| API | Purpose |
|---|---|
| `open` | Reflects the disclosed state and drives `aria-expanded`. |
| `static-state` / `staticState` | Keeps the burger closed when activated while allowing the click event to control an external disclosure. |
| `disabled` | Disables the native button and prevents `toggle()`. |
| `text` | Accessible button name; defaults to `Menu`. |
| `aria-label` / `accessibleLabel` | Overrides `text` with an explicit accessible name. |
| `aria-controls` / `controls` | References the controlled navigation ID. |
| `data-group-name` / `dataGroupName` | Synchronizes state through the Nextrap group open/close event. |
| `toggle()` | Toggles `open` unless disabled or `static-state` is enabled. |

Customize sizing and animation through `--size`, `--width`, `--bar-width`, and `--transition-duration`. Customize colors with `--color` and `--color-hover`. The `button`, `bar`, `bar-top`, `bar-middle`, and `bar-bottom` parts are available for themes.
