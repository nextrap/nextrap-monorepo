# @nextrap/nte-data-table

Renders a semantic native table from row objects and a typed `TableDefinition`, using `@nextrap/nte-table` for layout and interactions.

```ts
import '@nextrap/nte-data-table';
table.definition = { id: 'customers', rowId: 'id', columns: [{ id: 'name', header: 'Name', field: 'name' }] };
table.data = customers;
table.addEventListener('nte-data-table-view-state-change', ({ detail }) => save(detail.state));
```

Complex values are properties, not attributes. `TableViewState` can be read with `getViewState()` and restored with `setViewState()`.
