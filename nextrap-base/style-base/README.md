# style-base

Defines the core CSS variables and container width. This package will not add visual component styles or classes to the document.

`style-base` is token-only and must remain visually side-effect free.

## Runtime-first theming

For new themes prefer the runtime API. Sass emits the token relationships once; the actual theme inputs remain CSS custom properties and can be changed without recompiling Sass.

```scss
@use '@nextrap/style-base' as nt;

:where(.theme-example) {
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

The runtime engine derives mechanical values such as hover/active colors, surfaces, text/border colors and radius variants with CSS (`color-mix()`, `light-dark()` and `calc()`). `color-scheme: light dark` follows the operating-system preference; `[data-nt-scheme='light']` and `[data-nt-scheme='dark']` force a scheme.

Override a derived token only when the automatic result is a deliberate design exception:

```css
.theme-example {
  --nt-surface: light-dark(#fbfcfd, #101418);
  --nt-primary: light-dark(#0057b8, #65b7ff);
}
```

Keep component-specific customization out of the global token set. Prefer component mixins for known variants and `::part()` for precise component styling.

## Compile-time API

The existing `theme()` and `nextrap-theme()` mixins remain supported for compatibility and for cases that intentionally require Sass-time theme generation.

```scss
@use '@nextrap/style-base' as nt;

:root {
  @include nt.theme((primary: #0057b8, neutral: #667085));
}
```

For architecture rules shared by all style packages (`index.scss` API vs `default.scss` output, class↔mixin parity, composition), see `docs/style-packages-architecture.md`.

## Spacing model

Spacing is exposed in three layers:

1. Primitive scale tokens: `--nt-space-0` ... `--nt-space-10`
2. Semantic spacing aliases: `--nt-spacing-text`, `--nt-spacing-control`, `--nt-spacing-component`, `--nt-spacing-layout`, `--nt-spacing-section`
3. Component-local variables mapped from semantic/primitive tokens where a component genuinely needs a public runtime input

Use primitive tokens for exact sizing and semantic tokens for role-based spacing decisions.

## Responsibility split

- CSS custom properties: runtime values and mechanically derived values.
- Sass: selectors, mixin composition, loops/code generation and conditional bundle structure.
- Component `::part()`: precise, discoverable customization without growing component variable APIs.

**Important**: This package must not be included in the shadow DOM of components. Add it to the main document's style only once.
