---
name: nte-accordion-usage
description: "Use @nextrap/nte-accordion: NteAccordionElement and nte-accordion (element/API), NteAccordionItemElement and nte-accordion-item (element/API)."
---

# NTE Accordion usage

Use this skill for markup and component behavior. For theme SCSS, use `nte-accordion-theming`.

The primary authoring model is Markdown rendered by `@trunkjs/content-pane`; place the accordion inside a surrounding layout or content container. The Accordion normally has no heading of its own: after the surrounding heading and any introductory content, use an attributed horizontal rule as the intermediate container. Do not add a blank line between `---` and its Kramdown attribute. No explicit layout index is needed because Content Pane uses the preceding outline level plus `0.5`.

```markdown
## Frequently asked questions

Introductory content outside the accordion.

---
{: layout="nte-accordion[initial-open-index='0'][exclusive]"}

### First question

First answer.

### Second question

Second answer.
```

This is a package-specific exception to the general preference for attaching `layout` directly to a heading or content block. A dedicated Accordion heading is supported but not required. See the [architecture contract](../../ARCHITECTURE.md).

- `NteAccordionElement` / `<nte-accordion>` — Groups direct `section` children, propagates marker options and optionally keeps one item open. See the [Markdown accordion demo](../../demo/01-accordion.md).
- `NteAccordionItemElement` / `<nte-accordion-item>` — Provides an individual animated disclosure with `open`, `marker-position`, `marker-icon` and the `accordion-toggle` event. It is normally created from a direct Markdown section by the parent layout. See the [Markdown accordion demo](../../demo/01-accordion.md).
- Pair `<nte-accordion>` with layouts such as `<ntl-2col>` without adding outer component margins. See the [Markdown pairing demo](../../demo/02-ntl-2col-pairing.md).
