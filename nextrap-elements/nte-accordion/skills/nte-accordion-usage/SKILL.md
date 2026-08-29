---
name: nte-accordion-usage
description: "Use @nextrap/nte-accordion: NteAccordionElement and nte-accordion (element/API), NteAccordionItemElement and nte-accordion-item (element/API)."
---

# NTE Accordion usage

Use this skill for markup and component behavior. For theme SCSS, use `nte-accordion-theming`.

The primary authoring model is Markdown rendered by `@trunkjs/content-pane`; place the accordion inside a surrounding layout or content container. See the [architecture contract](../../ARCHITECTURE.md).

- `NteAccordionElement` / `<nte-accordion>` — Groups direct `section` children, propagates marker options and optionally keeps one item open. See the [Markdown accordion demo](../../demo/01-accordion.md).
- `NteAccordionItemElement` / `<nte-accordion-item>` — Provides an individual animated disclosure with `open`, `marker-position`, `marker-icon` and the `accordion-toggle` event. It is normally created from a direct Markdown section by the parent layout. See the [Markdown accordion demo](../../demo/01-accordion.md).
- Pair `<nte-accordion>` with layouts such as `<ntl-2col>` without adding outer component margins. See the [Markdown pairing demo](../../demo/02-ntl-2col-pairing.md).
