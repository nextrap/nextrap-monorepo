# @nextrap/nte-data-table

Display-only table viewport with a fixed header/footer, fixed column widths, hidden columns, pinned leading columns and programmatic selection. The native Light DOM table remains the only table.

## Import and basic usage

```ts
import '@nextrap/nte-data-table';
```

```scss
@use '@nextrap/nte-data-table/default';
```

```html
<nte-data-table height="32rem" pinned-columns="1" scroll-label="Customers">
  <table>
    <thead><tr><th class="border-free" data-column-id="id" data-width="6rem">ID</th><th data-column-id="name">Name <span class="indicator">▲</span></th></tr></thead>
    <tbody><tr id="customer-1"><th scope="row">1</th><td>Ada Lovelace</td></tr></tbody>
    <tfoot><tr><th>1</th><td>Customer</td></tr></tfoot>
  </table>
</nte-data-table>
```

Every row must contain the same number of cells and `colspan`/`rowspan` must remain `1` for column enhancements.

## API

- `height`, `pinned-columns`, `scroll-label` and host `aria-label` configure the viewport.
- Header `data-width`, inline `width`, or the native `width` attribute is resolved once and then fixed in pixels across all sections. Drag the header's inline-end edge to resize only that column.
- Header `hidden` or `data-hidden` hides the complete column.
- `sourceTable` returns the active native table. `refresh()` removes component-owned layout values, measures the current table again, and fixes every visible column in pixels.
- `remote` controls selection without observing selection classes.

```ts
const table = document.querySelector('nte-data-table');
table.remote.selectRow(0);                 // zero-based tbody index
table.remote.selectRow('customer-1');      // tr id or data-row-id
table.remote.toggleColumn('name');         // th id or data-column-id
table.remote.deselectColumn(1);            // zero-based column index
table.remote.clearSelection();
```

`selectRow`, `deselectRow`, `toggleRow`, `selectColumn`, `deselectColumn`, and `toggleColumn` return `false` when the target cannot be resolved.

## Visual classes

| Class | Place on | Effect |
| --- | --- | --- |
| `indicator` | Element inside `th` | Aligns a sort/status indicator at the inline end. |
| `selected` | `th`, `td`, or `tr` | Selected treatment; on a header cell it is propagated to the complete column. |
| `highlight` / `highlight-primary` | `th`, `td`, or `tr` | Primary highlight; a header marker applies to the complete column. |
| `highlight-secondary`, `highlight-success`, `highlight-info`, `highlight-warning`, `highlight-danger` | `th`, `td`, or `tr` | Semantic highlight; a header marker applies to the complete column. |
| `border-free` | `th` or `td` | Identifier/fixed-cell treatment; on a header cell it is propagated to the complete column. |
| `overflow-ellipsis` | `table`, `tr`, `th`, or `td` | Single-line ellipsis; also the default when no overflow class is present. |
| `overflow-clip` | `table`, `tr`, `th`, or `td` | Clips overflowing text without an ellipsis. |
| `overflow-wrap` | `table`, `tr`, `th`, or `td` | Wraps long content and permits a taller row. |
| `overflow-visible` | `table`, `tr`, `th`, or `td` | Deliberately allows visible overflow. |
| `with-header-strong`, `with-header-minimal` | `nte-data-table` | Alternative header treatment used with `style-default`. |
| `nte-data-table-header` | Wrapper before the component | Connected title/action/search toolbar. |
| `nte-data-table-search` | Search label inside the wrapper | Consistent search-field layout. |

An optional native `caption` is measured and kept fixed above the column header. The viewport renders a visual horizontal-scroll track when content overflows, including on mobile browsers that hide native scrollbars; `tbody` remains the only actual scroll container. The component never observes or clones the source table. Applications call `refresh()` after structural or layout-metadata changes.
