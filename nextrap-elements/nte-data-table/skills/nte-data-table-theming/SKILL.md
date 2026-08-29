---
name: nte-data-table-theming
description: "Theme @nextrap/nte-data-table through default-style(), the viewport part, and strictly scoped Light DOM table selectors."
---

# Nte Data Table Theming

Use this skill for theme SCSS. For markup and API, use `nte-data-table-usage`.

```scss
@use '@nextrap/nte-data-table' as dataTable;

nte-data-table.style-default {
  @include dataTable.default-style(
    $header-background: var(--nt-light),
    $cell-padding-inline: var(--nt-space-3)
  );
}
```

- `default-style()` owns the visual grid baseline; importing the Sass API alone emits no CSS.
- Style the Shadow scroll wrapper through `::part(viewport)`.
- Scope Light DOM rules to `nte-data-table > table` and direct sections/cells so nested tables remain untouched.
- Treat `data-nte-data-table-*` as read-only state hooks. Do not override the functional inline table layout, sizing, visibility or sticky-position styles owned by the component.
- Keep the single scroll layer, native table display, sticky positioning and opaque sticky-cell backgrounds intact.
- Use only one `style-*` class per component; `style-default` is added automatically when no style variant is present.
