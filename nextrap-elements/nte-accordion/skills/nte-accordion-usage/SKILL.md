---
name: nte-accordion-usage
description: "Use @nextrap/nte-accordion: NteAccordionElement and nte-accordion (element/API), NteAccordionItemElement and nte-accordion-item (element/API)."
---

# NTE Accordion usage

Use this skill for markup and component behavior. For theme SCSS, use `nte-accordion-theming`.

- `NteAccordionElement` / `<nte-accordion>` — Groups direct `section` children, propagates marker options and optionally keeps one item open. See the [accordion demo](../../demo/01-accordion.demo.ts).
- `NteAccordionItemElement` / `<nte-accordion-item>` — Provides an individual animated disclosure with `open`, `marker-position`, `marker-icon` and the `accordion-toggle` event. It is normally created from a direct `section` child by the parent. See the [accordion demo](../../demo/01-accordion.demo.ts).
- Pair `<nte-accordion>` with layouts such as `<ntl-2col>` without adding outer component margins. See the [pairing demo](../../demo/02-ntl-2col-pairing.demo.ts).
