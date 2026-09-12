---
name: nte-burger-usage
description: "Use @nextrap/nte-burger: <nte-burger> (element) and NteBurger (programmatic API) as an accessible responsive disclosure button for navigation with open, static-state, disabled, text, aria-controls, data-group-name, and toggle()."
---

# NTE Burger usage

- `<nte-burger>` — Renders an accessible responsive navigation disclosure button. See the [overview demo](../../demo/01-overview.demo.ts) and [API reference](references/nte-burger.md).
- `NteBurger` — Provides typed state and `toggle()` for programmatic control. See the [interactive demo](../../demo/02-interactive.demo.ts) and [API reference](references/nte-burger.md).

## JavaScript und Theme-Styling

`@nextrap/nte-burger` lädt die Default-Light-DOM-Styles automatisch. Für Seaming/Themes `@nextrap/nte-burger/unstyled` verwenden: Dieser Import lädt auch transitiv kein Light-DOM-CSS, damit das Theme die Darstellung selbst über die Sass-Mixins bestimmen kann. Sass-Imports behalten den Paketnamen ohne `/unstyled`.
