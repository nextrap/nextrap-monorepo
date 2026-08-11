# style-base

Defines the core css variables and container width. This package will not add any styles or classes to
the document.

## Usage

Include the `style-base` package in your main document's stylesheet. The package provides both, scss sources
and a compiled css file.

To work and modify themes of scss use the scss sources:

```scss
@use '@nextrap/style-base' with (
    $primary: $primary,
    $accent: $accent
);
```

This will set up the core design tokens and responsive container widths for your application.

## Spacing model

Spacing is exposed in three layers:

1. Primitive scale tokens: `--nt-space-0` ... `--nt-space-10`
2. Semantic spacing aliases: `--nt-spacing-text`, `--nt-spacing-control`, `--nt-spacing-component`,
   `--nt-spacing-layout`, `--nt-spacing-section`
3. Component-local variables mapped from semantic/primitive tokens (for example `--card-padding`)

Use primitive tokens for exact sizing and semantic tokens for role-based spacing decisions.

## Notes

**Important**: This package must not be included in the shadow DOM of components. Add it to
the main document's style only once.
