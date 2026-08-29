---
name: nte-data-table-theming
description: "Theme @nextrap/nte-data-table through its default, header, cell-state, toolbar and search Sass mixins."
---

# Nte Data Table Theming

Use this skill for theme SCSS. For markup and API, use `nte-data-table-usage`.

```scss
@use '@nextrap/nte-data-table' as dataTable;

nte-data-table.style-brand {
  @include dataTable.default-style();
  @include dataTable.header-strong($background: var(--nt-primary));
  @include dataTable.cell-states();
}
```

- `default-style()` emits the grid, default header, fixed-caption treatment, footer top border, zero-radius cells and ellipsis overflow baseline.
- `header-default()`, `header-strong()`, and `header-minimal()` provide composable header treatments.
- `cell-states()` styles indicators, selections, semantic highlights and border-free cells.
- `plugin-controls()` styles sort controls, drag handles, dragging state and drop targets.
- `nte-data-table-header()` and `nte-data-table-search()` style an external connected toolbar.
- The host owns the only outer border and border radius. Use `::part(viewport)` only for inner viewport color/layout and keep its border/radius at zero; native table descendants must remain radius-free.
- Treat `data-nte-data-table-*` as read-only state hooks. Preserve tbody-only scrolling, functional widths, visibility, sticky positioning and opaque pinned-cell backgrounds.
