---
name: nte-progress-usage
description: "Use @nextrap/nte-progress: <nte-progress> (element) and nteProgressElement (programmatic API) for determinate bar, circular, stepped, striped, and animated progress with progress-changed, step-changed, and completed events."
---

# NTE Progress usage

- `<nte-progress>` — Renders determinate progress as a native bar or circular indicator. See the [bar demo](../../demo/01-bars.demo.ts), [circle demo](../../demo/02-circles.demo.ts), and [API reference](references/nte-progress.md).
- `nteProgressElement` — Provides typed `value`, `min`, `max`, `steps`, `striped`, `animated`, and `type` properties for programmatic updates. See the [interactive demo](../../demo/03-interactive.demo.ts) and [API reference](references/nte-progress.md).

## JavaScript und Theme-Styling

`@nextrap/nte-progress` lädt die Default-Light-DOM-Styles automatisch. Für Seaming/Themes `@nextrap/nte-progress/unstyled` verwenden: Dieser Import lädt auch transitiv kein Light-DOM-CSS, damit das Theme die Darstellung selbst über die Sass-Mixins bestimmen kann. Sass-Imports behalten den Paketnamen ohne `/unstyled`.
