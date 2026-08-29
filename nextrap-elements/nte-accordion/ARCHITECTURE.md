# NTE Accordion architecture

## Purpose

`nte-accordion` is explicitly designed for use in Markdown rendered by
`@trunkjs/content-pane`. Authors describe the content as nested Markdown
sections and normally introduce the component with an attributed horizontal
rule between the surrounding heading and the item headings:

```markdown
## Frequently asked questions

Introductory content can remain outside the accordion.

---
{: layout="nte-accordion[initial-open-index='0'][exclusive]"}

### First question

First answer.

### Second question

Second answer.
```

The horizontal rule creates an intermediate container at the preceding outline
level plus `0.5`; no explicit layout index is needed. With a surrounding `h2`,
the following `h3` sections therefore become accordion items while other
content can remain directly in the `h2` section. Content Pane turns those child
sections into the Light DOM structure used by `nte-accordion`. The component then converts them into
`nte-accordion-item` elements and moves each first heading into the item's title
slot.

## Layout boundary

The accordion is an embedded content element, not a page or section layout. It
is intended to live inside a layout or content container such as a card,
content section, or `ntl-2col` column. The surrounding container owns external
spacing, width, backgrounds, and page composition; the accordion owns only the
disclosure grouping and item behavior.

Direct HTML remains a supported application-level API, but Markdown in Content
Pane is the primary authoring model and must be represented in package demos and
consumer documentation.

The Accordion is a deliberate exception to the general preference for attaching
`layout` to a content block or heading: it normally has no heading of its own,
so `---` immediately followed by `{: layout="nte-accordion..."}` is the preferred
container boundary. A dedicated Accordion heading remains optional.
