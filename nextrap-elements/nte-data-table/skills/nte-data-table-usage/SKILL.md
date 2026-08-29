---
name: nte-data-table-usage
description: "Use @nextrap/nte-data-table with its native Light DOM table, tbody-only scrolling, column states and programmatic selection Remote."
---

# Nte Data Table Usage

Use this skill for markup and component API. For theme SCSS, use `nte-data-table-theming`.

- Provide exactly one direct rectangular `<table>`; avoid `colspan`/`rowspan`.
- Set widths, visibility and stable identifiers on header cells with `data-width`, `hidden`/`data-hidden`, and `data-column-id`. Width inputs are resolved and fixed in pixels.
- Use `selected`, `highlight`, semantic `highlight-*`, or `border-free` on a header cell to propagate that state to its column. Use the same highlight/selected classes directly on body rows for row styling.
- Put sort/status content in a child with class `indicator`.
- Use `pinned-columns` for leading columns; only `tbody` scrolls while header/footer remain fixed.
- Use `remote.selectRow|deselectRow|toggleRow` and `remote.selectColumn|deselectColumn|toggleColumn`; accept a zero-based index, element, or stable ID. `clearSelection()` clears Remote selection.
- Activate plugins through `features`: `sort`, `reorder-columns`, and `reorder-rows`. Sorting supports header `data-sort-type`, cell `data-sort-value`, and `data-sortable="false"`; reorder plugins support `data-reorderable="false"`.
- Listen for `nte-data-table-sort`, `nte-data-table-column-reorder`, and `nte-data-table-row-reorder`.
- `NteDataTablePluginRegistry` exposes `register()`, `unregister()`, `create()`, and `has()` through `nteDataTablePluginRegistry`. An `NteDataTablePlugin.connect(context)` receives exact `host`, `table`, `remote`, and `refresh` references; implement `disconnect()` and optionally `refresh()`. Built-in classes are `NteDataTableSortPlugin`, `NteDataTableColumnReorderPlugin`, and `NteDataTableRowReorderPlugin`.
- Row strings resolve against `id`/`data-row-id`; column strings resolve against header `id`/`data-column-id`.
- Use `nte-data-table-header` and `nte-data-table-search` for a connected toolbar/search layout; filtering remains application behavior.
- Use an optional native `caption` for a fixed title, description, or search control above `thead`.
- Overflow defaults to ellipsis; override it with `overflow-ellipsis`, `overflow-clip`, `overflow-wrap`, or `overflow-visible` on the table, a row, or a cell.
- The Light DOM table remains the interactive table and is never observed or cloned. Call `refresh()` after structural or layout-input changes so all columns are remeasured and fixed in pixels.
