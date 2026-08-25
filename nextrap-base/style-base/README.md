# @nextrap/style-base

Global Nextrap design tokens implemented entirely with CSS custom properties.

`style-base` is token-only: it emits no reset, native-element styling, utility classes or component styles. Include it once at document/theme level, never inside component shadow DOM.

## The theming model

There is one theme engine: `runtime-theme()`.

It emits the complete default Nextrap token graph into the current selector. A theme is created by calling the mixin and then overriding only the CSS input variables that differ from the defaults. Derived colors, interaction states, surfaces, spacing aliases, typography scales, contrast colors and compatibility aliases are calculated from those variables by CSS.

There is no Sass theme map and no compile-time theme creation step.

## Use the default theme

For the standard Nextrap theme, import `default.scss` once:

```scss
@use '@nextrap/style-base/default';
```

This emits the runtime token graph on `:root` and enables explicit light/dark scheme selectors. Nothing else is required.

Use this when an application wants Nextrap defaults and does not own a separate theme stylesheet.

## Build a custom theme

Import the API and emit the runtime graph inside the scope that owns the theme:

```scss
@use '@nextrap/style-base' as nt;

:root {
  @include nt.runtime-theme();

  --nt-primary: #0057b8;
  --nt-accent: #d79b35;
  --nt-neutral: #667085;
  --nt-radius: .5rem;
  --nt-font-family: Inter, sans-serif;
  --nt-container-max: 1280px;
}

@include nt.runtime-scheme-selectors();
```

The order inside the selector is intentional: first emit `runtime-theme()`, then override inputs. The later declarations become the theme values while all derived variables continue to reference them.

A theme should normally override input tokens, not copy the generated token graph.

Typical theme inputs are:

- brand/state colors: `--nt-primary`, `--nt-secondary`, `--nt-tertiary`, `--nt-accent`, `--nt-success`, `--nt-info`, `--nt-warning`, `--nt-danger`, `--nt-neutral`
- typography: `--nt-font-family`, `--nt-font-family-header`, `--nt-font-size`, `--nt-font-size-header`, font weights and line heights
- shape: `--nt-radius`
- layout: `--nt-container-max`, `--nt-container-gutter`
- spacing primitives when a product intentionally owns a different scale: `--nt-space-0` through `--nt-space-10`

Override a derived token only for a deliberate design exception. For example, a product may intentionally choose a surface that should not be derived from `--nt-neutral`:

```scss
:root {
  @include nt.runtime-theme();

  --nt-primary: light-dark(#0057b8, #65b7ff);
  --nt-neutral: #667085;
  --nt-surface: light-dark(#fbfcfd, #101418);
}
```

## Build a scoped theme

Themes do not have to live on `:root`. Emit the graph in any theme scope:

```scss
@use '@nextrap/style-base' as nt;

:where(.theme-customer) {
  @include nt.runtime-theme();

  --nt-primary: #6d28d9;
  --nt-accent: #db2777;
  --nt-neutral: #71717a;
}
```

Descendant components consume the inherited `--nt-*` values. This allows multiple theme scopes on the same page without recompiling Sass.

## External theme repositories

An external theme package should own only its overrides and use `style-base` as the token engine:

```scss
@use '@nextrap/style-base' as nt;

:root {
  @include nt.runtime-theme();

  // Values owned by the external theme repository.
  --nt-primary: #0057b8;
  --nt-accent: #ffb000;
  --nt-neutral: #667085;
  --nt-radius: .375rem;
  --nt-font-family: 'Example Sans', sans-serif;
}

@include nt.runtime-scheme-selectors();
```

Do not duplicate Nextrap's derived variables in the external repository unless the design explicitly needs an exception. This keeps new derived tokens and fixes in `style-base` available to external themes automatically.

## Light and dark schemes

`runtime-theme()` declares `color-scheme: light dark`. Derived tokens use CSS mechanisms such as `light-dark()` and `color-mix()`, so the same token graph can react to the active color scheme.

To let the OS choose, no additional theme generation is necessary.

To let the application force a scheme, emit the selectors once:

```scss
@include nt.runtime-scheme-selectors();
```

Then set one of these attributes on an ancestor/document element:

```html
<html data-nt-scheme="light">
<html data-nt-scheme="dark">
```

Theme-specific light/dark values can be expressed directly in an input variable:

```css
--nt-primary: light-dark(#0057b8, #65b7ff);
```

## Spacing model

Spacing has two layers:

1. `--nt-space-0` through `--nt-space-10` are primitive scale steps.
2. Semantic aliases express intent: `--nt-spacing-text`, `--nt-spacing-control`, `--nt-spacing-component`, `--nt-spacing-layout`, `--nt-spacing-section`.

Prefer semantic spacing in application/component code. The structural progression is **text → control → component → layout → section**.

```css
.article-copy > * + * { margin-block-start: var(--nt-spacing-text); }
.toolbar { gap: var(--nt-spacing-control); }
.card { padding: var(--nt-spacing-component); }
.card-grid { gap: var(--nt-spacing-layout); }
.page-section + .page-section { margin-block-start: var(--nt-spacing-section); }
```

## Component contract

Components consume global tokens through `var(--nt-*)`:

```css
.btn {
  --btn-bg: var(--nt-primary);
  --btn-bg-hover: var(--nt-primary-hover);
  --btn-text: var(--nt-text-on-primary);

  background: var(--btn-bg);
  color: var(--btn-text);
}

.btn:hover {
  background: var(--btn-bg-hover);
}
```

Components must not depend on private Sass theme maps or recreate global theme calculations. Component-specific customization belongs in component-local variables, mixins or `::part()` APIs.

## API summary

`@nextrap/style-base` exports only:

- `runtime-theme()` — emits the complete default/runtime token graph into the current selector.
- `runtime-scheme-selectors()` — emits `[data-nt-scheme='light']` and `[data-nt-scheme='dark']` scheme forcing selectors.

`@nextrap/style-base/default` remains the ready-to-use standard theme and is equivalent to emitting the runtime graph on `:root` plus the scheme selectors.

For the complete CSS-variable contract and guidance for every token, see `.ai-usage-info.md`.
