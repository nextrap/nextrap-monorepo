---
name: nte-data-table-usage
description: "Use @nextrap/nte-data-table with its native Light DOM table, tbody-only scrolling, column states and programmatic selection Remote."
---

# Nte Data Table Usage

Use this skill for markup and component API. For theme SCSS, use `nte-data-table-theming`.

- Provide exactly one direct rectangular `<table>`; avoid `colspan`/`rowspan`.
- Set widths, visibility and stable identifiers on header cells with `data-width`, `hidden`/`data-hidden`, and `data-column-id`.
- Use `selected`, `highlight`, semantic `highlight-*`, or `border-free` on a header cell to propagate that state to its column. Use the same highlight/selected classes directly on body rows for row styling.
- Put sort/status content in a child with class `indicator`.
- Use `pinned-columns` for leading columns; only `tbody` scrolls while header/footer remain fixed.
- Use `remote.selectRow|deselectRow|toggleRow` and `remote.selectColumn|deselectColumn|toggleColumn`; accept a zero-based index, element, or stable ID. `clearSelection()` clears Remote selection.
- Row strings resolve against `id`/`data-row-id`; column strings resolve against header `id`/`data-column-id`.
- Use `nte-data-table-header` and `nte-data-table-search` for a connected toolbar/search layout; filtering remains application behavior.
- The Light DOM table remains the interactive table. Use `refresh()` only when normal layout observation cannot see a layout input.
