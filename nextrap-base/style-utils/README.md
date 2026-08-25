# @nextrap/style-utils

Utility mixins and ready-to-use classes backed by the runtime tokens from `@nextrap/style-base`.

## Color utilities

### Background only: `bg-*`

`bg-*` deliberately changes **only the background**. Use it when foreground color is managed separately.

```html
<div class="bg-primary">...</div>
<div class="bg-dark text-white">...</div>
```

Examples include `.bg-primary`, `.bg-secondary`, `.bg-success`, `.bg-warning`, `.bg-danger`, `.bg-light`, `.bg-dark`, `.bg-white`, `.bg-black` and the existing subtle/emphasis variants.

### Readable surfaces: `surface-*`

Use `surface-*` when the element is a complete colored surface. A surface sets the semantic background **and its matching contrast foreground** from style-base (`--nt-text-on-*`). This is the preferred utility for colored sections, heroes, callouts, cards and controls where the background determines readability.

```html
<section class="surface-primary">
  <h2>Primary section</h2>
  <p>The foreground uses --nt-text-on-primary.</p>
</section>

<footer class="surface-black">...</footer>
```

Available classes and mixins:

- `surface-primary`
- `surface-secondary`
- `surface-tertiary`
- `surface-accent`
- `surface-success`
- `surface-info`
- `surface-warning`
- `surface-danger`
- `surface-light`
- `surface-dark`
- `surface-white`
- `surface-black`

Sass usage:

```scss
@use '@nextrap/style-utils' as u;

.hero {
  @include u.surface-primary();
}
```

Do not change `bg-*` to implicitly set text color. `bg-*` is an atomic background utility; `surface-*` is the explicit background + foreground contract.

## Local light/dark scheme

Light/dark mode is not limited to the whole page. `color-scheme` is inherited, so a section can force a scheme for itself and its descendants. Use `.scheme-light` or `.scheme-dark` when **all scheme-aware tokens and components in a subtree** should evaluate in that mode.

```html
<main>
  <section>Uses the page/system scheme</section>

  <section class="scheme-dark surface-dark">
    Dark/inverted section. Descendant light-dark() tokens evaluate as dark.
  </section>

  <section>Back to the page/system scheme</section>
</main>
```

A nested subtree may switch again:

```html
<section class="scheme-dark surface-dark">
  Dark section
  <aside class="scheme-light surface-light">Locally light again</aside>
</section>
```

`surface-dark` and `scheme-dark` have different responsibilities:

- `surface-dark` chooses a concrete dark background and its readable foreground.
- `scheme-dark` changes the light/dark evaluation context for the entire subtree but does not choose a background.

They may be used independently or together.

Sass usage:

```scss
.inverted-section {
  @include u.scheme-dark();
  @include u.surface-dark();
}
```

## Default and scoped output

For ready-to-use classes:

```scss
@use '@nextrap/style-utils/default';
```

For mixins only:

```scss
@use '@nextrap/style-utils' as u;
```

The complete utility registry can also be scoped:

```scss
.theme {
  @include u.utils();
}
```
