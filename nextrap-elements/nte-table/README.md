# @nextrap/nte-table

Display-only table viewport with a fixed header/footer, fixed column widths, hidden columns, pinned leading columns and programmatic selection. The native Light DOM table remains the only table.

## Import and basic usage

```ts
import '@nextrap/nte-table';
```

```scss
@use '@nextrap/nte-table/default';
```

```html
<nte-table height="32rem" pinned-columns="1" scroll-label="Customers">
  <table>
    <thead><tr><th class="border-free" data-column-id="id" data-width="6rem">ID</th><th data-column-id="name">Name <span class="indicator">▲</span></th></tr></thead>
    <tbody><tr id="customer-1"><th scope="row">1</th><td>Ada Lovelace</td></tr></tbody>
    <tfoot><tr><th>1</th><td>Customer</td></tr></tfoot>
  </table>
</nte-table>
```

Every row must contain the same number of cells and `colspan`/`rowspan` must remain `1` for column enhancements.

## API

- `height` configures the `tbody` scroll viewport; `pinned-columns`, `scroll-label` and host `aria-label` configure its behavior and accessible name.
- `features` activates registered plugins by whitespace- or comma-separated name.
- Header `data-width`, inline `width`, or the native `width` attribute is resolved once and then fixed in pixels across all sections. Drag the header's inline-end edge to resize only that column.
- Real columns keep their configured widths. A presentation-only `tr::after` filler cell absorbs any unused body width and is not part of the table API or accessibility tree.
- Header `hidden` or `data-hidden` hides the complete column.
- `sourceTable` returns the active native table. `refresh()` removes component-owned layout values, measures the current table again, and fixes every visible column in pixels.
- `remote` controls selection without observing selection classes.

```ts
const table = document.querySelector('nte-table');
table.remote.selectRow(0);                 // zero-based tbody index
table.remote.selectRow('customer-1');      // tr id or data-row-id
table.remote.toggleColumn('name');         // th id or data-column-id
table.remote.deselectColumn(1);            // zero-based column index
table.remote.clearSelection();
```

`selectRow`, `deselectRow`, `toggleRow`, `selectColumn`, `deselectColumn`, and `toggleColumn` return `false` when the target cannot be resolved.

## Plugins

Built-in plugins are enabled declaratively:

```html
<nte-table features="sort resize-columns reorder-columns reorder-rows">
  <table>…</table>
</nte-table>
```

- `sort` adds accessible sort controls to headers and reorders the existing `tbody > tr` elements. Use header `data-sort-type="string|number|date"`, cell `data-sort-value`, or `data-sortable="false"`.
- `reorder-columns` adds header drag handles and moves the corresponding native cells in every table section. Use header `data-reorderable="false"` to opt out.
- `reorder-rows` adds drag handles to the first cell of each body row and moves the native row. Use row `data-reorderable="false"` to opt out.

Both reorder plugins use Pointer Events. During a drag, a neutral `aria-hidden` ghost covers only the visible, viewport-clipped extent of the row or column, the hidden original reserves its exact position, and displaced rows/cells animate into their preview positions. Off-screen parts of long rows or columns never enlarge the ghost. Pointer cancellation restores the original order; dragging near the body edge scrolls only `tbody`.

The plugins emit `nte-table-sort`, `nte-table-column-reorder`, and `nte-table-row-reorder` events. They work directly on the Light DOM table and call `refresh()` after structural changes.

Register application plugins before the component connects:

```ts
import { nteTablePluginRegistry, type NteTablePlugin } from '@nextrap/nte-table';

nteTablePluginRegistry.register('audit', () => new AuditTablePlugin());
```

An `NteTablePlugin` receives `host`, `table`, `remote`, and `refresh()` through `connect(context)`, plus optional `refresh()` and required `disconnect()` lifecycle methods.

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
| `with-header-strong`, `with-header-minimal` | `nte-table` | Alternative header treatment used with `style-default`. |
| `nte-table-header` | Wrapper before the component | Connected title/action/search toolbar. |
| `nte-table-search` | Search label inside the wrapper | Consistent search-field layout. |

An optional native `caption` stays in normal flow above the column header. The component host is the only element that owns the outer border and radius; nested table elements draw only internal separators and remain radius-free. Native table margin/padding are reset, header/footer cells remain single-line, and the last body row keeps a bottom separator before unused white viewport space. `tbody` receives the configured height and remains the only actual scroll container, while `thead` and `tfoot` stay in normal flow outside its native scrollbars. The component never observes or clones the source table. Applications call `refresh()` after structural or layout-metadata changes.
