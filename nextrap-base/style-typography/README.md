# @nextrap/style-typography

Typography styles and composable Sass mixins for native text elements and rich-text/prose content.

## Runtime token contract

`style-typography` consumes the public `--nt-*` runtime tokens from `@nextrap/style-base`. It owns text rhythm and element treatment, not page/section layout.

### Color inheritance and surfaces

Normal document text (`h1`–`h6`, `p`, `.lead`, `pre`) inherits `color` from its containing context. This is intentional: semantic `surface-*` utilities from `@nextrap/style-utils` set the readable foreground for a section, and typography must not overwrite it with the global `--nt-text` value.

```html
<section class="surface-primary">
  <h2>Readable heading</h2>
  <p>This text inherits the matching --nt-text-on-primary foreground.</p>
  <p class="text-muted">Muted text uses the local surface-muted foreground.</p>
</section>
```

Surface-aware typography may consume these inherited local context variables when present:

- `--nt-surface-text` — primary foreground of the active semantic surface.
- `--nt-surface-text-muted` — lower-emphasis readable foreground for captions, definitions, blockquotes and `.text-muted`.
- `--nt-surface-link` / `--nt-surface-link-hover` — optional local link foregrounds.

Outside a semantic surface, typography falls back to the global semantic tokens such as `--nt-text-muted`, `--nt-link` and `--nt-link-hover`.

### Spacing

Typography-specific spacing variables remain valid semantic overrides, but their defaults are derived from the central runtime spacing scale where possible. Examples:

- `--nt-heading-margin-bottom` → `--nt-space-2`
- `--nt-paragraph-margin-bottom` → `--nt-space-4`
- `--nt-list-padding-left` → `--nt-space-6`
- `--nt-figure-caption-margin-top` → `--nt-space-2`

Consumers can override the semantic typography token without replacing the global spacing scale.

### Interaction

Links use the shared interaction timing contract from style-base:

- `--nt-transition-duration`
- `--nt-transition-easing`
- `--nt-focus-ring-width`
- `--nt-focus-ring-offset`

Do not hard-code component-specific transition durations when the shared runtime interaction tokens are appropriate.

## Sass API

`index.scss` exposes the composable mixins. `default.scss` materializes the standard typography selectors/classes. Individual mixins can be applied to arbitrary selectors in theme/component layers.

See [prose.md](./demo/prose.md) for rich-text examples.
