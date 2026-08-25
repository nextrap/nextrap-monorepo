# @nextrap/style-base

Global Nextrap design tokens implemented entirely with CSS custom properties.

`style-base` is token-only: it emits no reset, native-element styling, utility classes or component styles. Include it once at document/theme level, never inside component shadow DOM.

## The theming model

There is one theme engine and one public mixin: `runtime-theme()`.

It emits the complete default Nextrap token graph into the current selector **and** the global selectors required to force light or dark mode. A theme is created by calling the mixin and then overriding only the CSS input variables that differ from the defaults. Derived colors, interaction states, surfaces, spacing aliases, typography scales and contrast colors are calculated from those variables by CSS.

There is no Sass theme map, compile-time theme creation step or separate scheme mixin.

## Use the default theme

For the standard Nextrap theme, import `default.scss` once:

```scss
@use '@nextrap/style-base/default';
```

This emits `runtime-theme()` on `:root`. Nothing else is required.

## Build a custom theme

```scss
@use '@nextrap/style-base' as nt;

:root {
  @include nt.runtime-theme();

  --nt-primary: light-dark(#0057b8, #65b7ff);
  --nt-accent: light-dark(#d79b35, #f0b95c);
  --nt-neutral: #667085;
  --nt-radius: .5rem;
  --nt-font-family: Inter, sans-serif;
  --nt-container-max: 1280px;
}
```

The order is intentional: emit `runtime-theme()` first, then override inputs. The later declarations become the theme values while all derived variables continue to reference them.

A theme should normally override input tokens, not copy the generated token graph. Typical inputs are brand/state colors, typography, `--nt-radius`, container values and—when intentionally customized—the primitive spacing scale.

Override a derived token only for a deliberate design exception.

## Light and dark switching

Light/dark switching is built into `runtime-theme()`. With no `data-nt-scheme` attribute, the browser follows the operating-system preference. To force a mode, set `data-nt-scheme="light"` or `data-nt-scheme="dark"` on the document element. Remove the attribute to return to the OS preference.

Theme inputs can provide scheme-specific values with `light-dark()`:

```css
--nt-primary: light-dark(#0057b8, #65b7ff);
--nt-accent: light-dark(#d79b35, #f0b95c);
```

Light and dark are two schemes of the same theme, not separate theme definitions.

## Shared interaction-state contract

Interaction intensity is a global design decision, not a component-local constant. `style-base` therefore owns the percentages used to change interactive colors:

```css
--nt-interaction-hover: 10%;
--nt-interaction-active: 15%;
--nt-interaction-emphasis: 20%;
```

All semantic `-hover`, `-active` and `-emphasis` colors are derived from these values. A theme may override the percentages once to make interaction feedback globally stronger or softer.

**Every interactive Nextrap element must reuse this contract.** Buttons, accordions, tabs, navigation items, clickable cards, menus, list actions and future components must not introduce arbitrary local hover/active percentages when the standard interaction behavior is intended.

For semantic colors, consume the generated state token directly:

```css
.button {
  background: var(--nt-primary);
  color: var(--nt-text-on-primary);
}

.button:hover {
  background: var(--nt-primary-hover);
}

.button:active {
  background: var(--nt-primary-active);
}
```

For a component with a custom/local background that has no semantic `-hover` token, use the same global intensity token:

```css
.clickable-card:hover {
  background: color-mix(
    in oklch,
    var(--card-background),
    light-dark(black, white) var(--nt-interaction-hover)
  );
}

.clickable-card:active {
  background: color-mix(
    in oklch,
    var(--card-background),
    light-dark(black, white) var(--nt-interaction-active)
  );
}
```

This rule keeps hover and pressed feedback visually consistent across packages. A component-specific percentage is allowed only for a documented design exception where the global interaction strength is intentionally inappropriate.

## Build a scoped theme

Themes do not have to live on `:root`:

```scss
@use '@nextrap/style-base' as nt;

:where(.theme-customer) {
  @include nt.runtime-theme();
  --nt-primary: light-dark(#6d28d9, #a78bfa);
  --nt-accent: light-dark(#db2777, #f472b6);
  --nt-neutral: #71717a;
}
```

Descendant components inherit the resulting `--nt-*` values.

## External theme repositories

An external theme package should own only its overrides and use `style-base` as the token engine. Do not duplicate Nextrap's derived variables unless the design explicitly needs an exception. This keeps new derived tokens and fixes in `style-base` available automatically.

## Spacing model

Spacing has two layers: `--nt-space-0` through `--nt-space-10` are primitive scale steps, while semantic aliases express intent: `--nt-spacing-text`, `--nt-spacing-control`, `--nt-spacing-component`, `--nt-spacing-layout`, `--nt-spacing-section`.

Prefer semantic spacing in application/component code. The structural progression is **text → control → component → layout → section**.

## Component contract

Components consume global tokens through `var(--nt-*)` and must not depend on private Sass theme state or recreate global theme calculations. In particular, components must reuse `--nt-interaction-hover`, `--nt-interaction-active` and the generated semantic state colors for interaction feedback rather than hard-coding their own percentages.

## API summary

`@nextrap/style-base` exports one theming mixin:

- `runtime-theme()` — emits the complete runtime token graph, shared interaction-state contract and automatic/manual light-dark scheme support.

`@nextrap/style-base/default` remains the ready-to-use standard theme and emits `runtime-theme()` on `:root`.

For the complete CSS-variable contract and guidance for every token, see `.ai-usage-info.md`.
