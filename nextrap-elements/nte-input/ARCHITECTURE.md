# `@nextrap/nte-input` architecture

## Styling ownership

`nte-input` separates the visual baseline from optional modifiers.

- A theme/style owns control geometry, spacing, colors, borders and state presentation.
- A modifier such as `hoverlabel` may add behavior or positioning, but must not silently replace theme-owned control geometry.
- Existing `.default` and `.carbon` selectors are legacy public selectors. New style variants follow the repository contract and use exactly one `style-*` class.
- Feature modifiers remain independently composable. New modifier names use `with-*` where a public class is introduced.

## Theme and modifier compatibility

Theme-dependent modifier values must be explicit and machine-readable. A modifier must use one of these approaches:

1. **Preferred:** the active theme exports the required values as `--nte-input-*` custom properties and the modifier consumes those properties. This lets the modifier adapt automatically without knowing the theme name.
2. **Allowed when automatic composition is impossible:** the modifier selector is explicitly scoped to the supported `style-*` variant(s).
3. **Not allowed:** a generic modifier overrides dimensions, padding, colors or other baseline values with constants chosen for one theme and thereby changes another theme as a side effect.

`hoverlabel` follows the preferred model. The active input theme exports `--nte-input-control-padding-x` and `--nte-input-hoverlabel-background`; the floating-label mixin consumes them and only owns label positioning. It must not change control height or vertical input padding.

## Dark-theme contract

Theme maps must use semantic Nextrap tokens (`--nt-text`, `--nt-body`, `--nt-primary`, `--nt-danger`, `--nt-success`, `--nt-border-color`, etc.) or token-based `color-mix(...)` expressions for colors that must react to the active light/dark scheme.

Fixed light-scheme colors are only allowed when a value is intentionally invariant and that invariance is documented next to the declaration. Carbon-like geometry may stay fixed, but its surfaces, text, borders and feedback colors must remain theme-aware.

## Regression prevention

Changes to a theme or modifier must be reviewed against every supported composition, especially:

- default + plain label;
- default + hoverlabel;
- Carbon + plain label;
- Carbon + hoverlabel;
- light and dark color schemes for each visual style.

A style change is incomplete when it only validates the variant that motivated the change. The PR description must state which compositions were checked and whether the change affects theme-owned geometry or modifier-owned behavior.
