---
name: nte-table-usage
description: "Use @nextrap/nte-table with its native Light DOM table, tbody-only scrolling, column states and programmatic selection Remote."
---

# Nte Table Usage

Use this skill for markup and component API. For theme SCSS, use `nte-table-theming`.

- Provide exactly one direct rectangular `<table>`; avoid `colspan`/`rowspan`.
- Set widths, visibility and stable identifiers on header cells with `data-width`, `hidden`/`data-hidden`, and `data-column-id`. Width inputs are resolved and fixed in pixels.
- Real columns keep their resolved widths; a non-semantic CSS filler after every row absorbs unused body width without participating in column APIs.
- Use `selected`, `highlight`, semantic `highlight-*`, or `border-free` on a header cell to propagate that state to its column. Use the same highlight/selected classes directly on body rows for row styling.
- Put sort/status content in a child with class `indicator`.
- Use `height` for the `tbody` scroll viewport and `pinned-columns` for leading columns; header/footer remain in normal flow outside the body scrollbars.
- Use `remote.selectRow|deselectRow|toggleRow` and `remote.selectColumn|deselectColumn|toggleColumn`; accept a zero-based index, element, or stable ID. `clearSelection()` clears Remote selection.
- Activate plugins through `features`: `sort`, `reorder-columns`, and `reorder-rows`. Sorting supports header `data-sort-type`, cell `data-sort-value`, and `data-sortable="false"`; reorder plugins support `data-reorderable="false"`.
- Reorder handles use Pointer Events with a neutral ghost limited to the row/column's visible, viewport-clipped bounding extent, an exact-size hidden original placeholder, animated preview moves, cancellation rollback, and tbody-only edge auto-scroll.
- Listen for `nte-table-sort`, `nte-table-column-reorder`, and `nte-table-row-reorder`.
- `NteTablePluginRegistry` exposes `register()`, `unregister()`, `create()`, and `has()` through `nteTablePluginRegistry`. An `NteTablePlugin.connect(context)` receives exact `host`, `table`, `remote`, and `refresh` references; implement `disconnect()` and optionally `refresh()`. Built-in classes are `NteTableSortPlugin`, `NteTableColumnReorderPlugin`, and `NteTableRowReorderPlugin`.
- Row strings resolve against `id`/`data-row-id`; column strings resolve against header `id`/`data-column-id`.
- Use `nte-table-header` and `nte-table-search` for a connected toolbar/search layout; filtering remains application behavior.
- Use an optional native `caption` for a fixed title, description, or search control above `thead`.
- Overflow defaults to ellipsis; override it with `overflow-ellipsis`, `overflow-clip`, `overflow-wrap`, or `overflow-visible` on the table, a row, or a cell.
- The Light DOM table remains the interactive table and is never observed or cloned. Call `refresh()` after structural or layout-input changes so all columns are remeasured and fixed in pixels.
