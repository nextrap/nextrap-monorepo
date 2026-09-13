---
name: nte-scroll-to-top-usage
description: "Use @nextrap/nte-scroll-to-top: NteScrollToTop (programmatic API and element implementation) and <nte-scroll-to-top> (element)."
---

# NTE Scroll to Top usage

- `NteScrollToTop` — Registers and implements the scroll-to-top element for programmatic imports. See the [demo](../../demo/01-overview.demo.ts).
- `<nte-scroll-to-top>` — Shows an accessible return-to-top button after a configurable scroll threshold. See the [demo](../../demo/01-overview.demo.ts) and the [theming skill](../nte-scroll-to-top-theming/SKILL.md).

## JavaScript und Theme-Styling

`@nextrap/nte-scroll-to-top` lädt die Default-Light-DOM-Styles automatisch. Für Seaming/Themes `@nextrap/nte-scroll-to-top/unstyled` verwenden: Dieser Import lädt auch transitiv kein Light-DOM-CSS, damit das Theme die Darstellung selbst über die Sass-Mixins bestimmen kann. Sass-Imports behalten den Paketnamen ohne `/unstyled`.
