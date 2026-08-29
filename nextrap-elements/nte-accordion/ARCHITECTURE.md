# NTE Accordion architecture

## Purpose

`nte-accordion` is explicitly designed for use in Markdown rendered by
`@trunkjs/content-pane`. Authors describe the content as nested Markdown
sections and select the component through a layout attribute:

```markdown
### Frequently asked questions
{: layout="nte-accordion[initial-open-index='0'][exclusive]"}

#### First question

First answer.

#### Second question

Second answer.
```

Content Pane turns the direct child sections into the Light DOM structure used
by `nte-accordion`. The component then converts those sections into
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
