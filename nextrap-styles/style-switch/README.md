# @nextrap/style-switch

Accessible CSS switch styles with a side-effect-free Sass API.

## Ready-to-use CSS

```scss
@use '@nextrap/style-switch/default';
```

```html
<label class="switch switch-material">
  <input class="switch-input" type="checkbox" role="switch" checked />
  <span class="switch-control" aria-hidden="true"></span>
  <span class="switch-label">Dark Mode</span>
</label>
```

The native checkbox owns the state. Use `role="switch"`, provide a visible label or an `aria-label`, and do not maintain `aria-checked` manually.

## Sass API

```scss
@use '@nextrap/style-switch' as switch;

.account-switch {
  @include switch.switch();
  @include switch.switch-outline();
}
```

Available modifiers are `switch-sm`, `switch-lg`, `switch-xl`, `switch-outline`, `switch-material`, `switch-square`, `switch-icon`, and `switch-label-start`.

## Development

```bash
nx dev style-switch
nx build style-switch
```
