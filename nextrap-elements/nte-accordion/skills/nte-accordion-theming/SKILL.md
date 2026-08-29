---
name: nte-accordion-theming
description: "Theme @nextrap/nte-accordion with default-style(), with-details-end(), with-marker-start(), with-marker-plus(), and with-modifier-classes() (Sass APIs)."
---

# NTE Accordion theming

Use this skill only for theme SCSS. For markup and behavior, use `nte-accordion-usage`.

- `default-style()` — Defines the complete visual baseline through public variables and the `accordion`, `details`, `summary`, `title`, `marker`, and `content` parts. See the [demo theme](../../demo/main.scss).
- `with-details-end()` — Places the summary after the content. See the [Sass source](../../src/scss/_with-details-end.scss).
- `with-marker-start()` — Places the marker before the title. See the [Markdown accordion demo](../../demo/01-accordion.md).
- `with-marker-plus()` — Uses plus/minus marker icons. See the [Markdown accordion demo](../../demo/01-accordion.md).
- `with-modifier-classes()` — Maps the shipped `.details-end`, `.marker-start`, and `.marker-plus` modifier classes to their mixins. Compose the baseline on one `style-*` class and keep functional layout behavior intact.
