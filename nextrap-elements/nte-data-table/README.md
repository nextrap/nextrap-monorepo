# @nextrap/nte-data-table

Renders a semantic native table from row objects and a typed `TableDefinition`, using `@nextrap/nte-table` for layout and interactions.

```ts
import '@nextrap/nte-data-table';
table.definition = { id: 'customers', rowId: 'id', columns: [{ id: 'name', header: 'Name', field: 'name' }] };
table.data = customers;
table.addEventListener('nte-data-table-view-state-change', ({ detail }) => save(detail.state));
```

Complex values are properties, not attributes. `TableViewState` can be read with `getViewState()` and restored with `setViewState()`.

Leading columns support `pinned: true` defaults. Supplying `viewState.pinnedColumns` overrides them with stable column IDs; an empty array explicitly disables pinning. A column `footer` can be static content or a callback over the rendered rows and creates a fixed native footer row.
