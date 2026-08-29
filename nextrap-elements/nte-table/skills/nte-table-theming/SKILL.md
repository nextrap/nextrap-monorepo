---
name: nte-table-theming
description: "Theme @nextrap/nte-table through its default, header, cell-state, toolbar and search Sass mixins."
---

# Nte Table Theming

Use this skill for theme SCSS. For markup and API, use `nte-table-usage`.

```scss
@use '@nextrap/nte-table' as table;

nte-table.style-brand {
  @include table.default-style();
  @include table.header-strong($background: var(--nt-primary));
  @include table.cell-states();
}
```

- `default-style()` emits the grid, default header, fixed-caption treatment, footer top border, zero-radius cells and ellipsis overflow baseline.
- `header-default()`, `header-strong()`, and `header-minimal()` provide composable header treatments.
- `cell-states()` styles indicators, selections, semantic highlights and border-free cells.
- `plugin-controls()` styles sort controls, drag handles, dragging state and drop targets.
- Preserve the neutral, `aria-hidden`, viewport-clipped drag ghost, hidden-original placeholders, drop-target indicators, and reduced-motion handling used by the animated Pointer Event reorder previews.
- `nte-table-header()` and `nte-table-search()` style an external connected toolbar.
- The host owns the only outer border and border radius. Use `::part(viewport)` only for inner viewport color/layout and keep its border/radius at zero; native table descendants must remain radius-free.
- Preserve the component's zero table margin/padding, single-line header/footer cells, section-colored `tr::after` filler cells, their non-sizing inline-start separator when remainder space exists, and the final body-row separator.
- Treat `data-nte-table-*` as read-only state hooks. Preserve tbody-only scrolling, functional widths, visibility, sticky positioning and opaque pinned-cell backgrounds.
