---
name: nte-data-table-usage
description: "Use NteDataTableElement, TableDefinition, TableColumnDefinition, TableViewState, NteDataTableCellRendererRegistry, getViewState(), setViewState() and refresh() to render object arrays as tables."
---

# NTE Data Table Usage

- `NteDataTableElement.data`: readonly row array.
- `NteDataTableElement.definition`: developer schema with stable row/column IDs.
- `NteDataTableElement.viewState`, `getViewState()`, `setViewState()`: serializable user layout.
- Set `TableColumnDefinition.pinned` for leading default pins. When `viewState.pinnedColumns` is present—even as `[]`—its stable IDs override those defaults. Only a contiguous run of leading visible columns can be pinned by the composed `nte-table`.
- Set `TableColumnDefinition.footer` to text, a Node, or a callback receiving the rendered rows. If any column has footer content, the component renders one fixed native `tfoot` row.
- `NteDataTableCellRendererRegistry.register|get|has|unregister`: shared cell presets.
- `nte-data-table-view-state-change`: persist its `detail.state` in the application.
- Use `nte-table` directly when markup already contains the native table.
- Editing belongs to the future editable package.

See `README.md`, `demo/01-data.demo.ts`, `demo/02-pinned-footer.demo.ts`, and `demo/03-view-state.demo.ts`.
