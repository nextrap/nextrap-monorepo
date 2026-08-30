---
name: nte-data-table-usage
description: "Use NteDataTableElement, TableDefinition, TableColumnDefinition, TableViewState, NteDataTableCellRendererRegistry, getViewState(), setViewState() and refresh() to render object arrays as tables."
---

# NTE Data Table Usage

- `NteDataTableElement.data`: readonly row array.
- `NteDataTableElement.definition`: developer schema with stable row/column IDs.
- `NteDataTableElement.viewState`, `getViewState()`, `setViewState()`: serializable user layout.
- `NteDataTableCellRendererRegistry.register|get|has|unregister`: shared cell presets.
- `nte-data-table-view-state-change`: persist its `detail.state` in the application.
- Use `nte-table` directly when markup already contains the native table.
- Editing belongs to the future editable package.

See `README.md` and `demo/01-data.demo.ts`.
