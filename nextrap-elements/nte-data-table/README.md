# @nextrap/nte-data-table

Display-only table viewport with a sticky header/footer, fixed column widths, hidden columns and pinned leading columns.

The native Light DOM table remains the only table. Native events, focus, form controls and framework bindings therefore keep working without an event bridge.

## Import

```ts
import '@nextrap/nte-data-table';
```

Load the default visual style in the app/theme:

```scss
@use '@nextrap/nte-data-table/default';
```

## Usage

```html
<nte-data-table height="32rem" pinned-columns="2" scroll-label="Customers">
  <table>
    <caption>Customers</caption>
    <thead>
      <tr>
        <th data-width="14rem" scope="col">Name</th>
        <th data-width="10rem" scope="col">Company</th>
        <th data-width="8rem" scope="col" hidden>Status</th>
        <th data-width="16rem" scope="col">Email</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">Ada Lovelace</th>
        <td>Analytical Engines</td>
        <td>Active</td>
        <td><a href="mailto:ada@example.test">ada@example.test</a></td>
      </tr>
    </tbody>
    <tfoot>
      <tr>
        <th scope="row">Total</th>
        <td>1 company</td>
        <td>1 active</td>
        <td>1 email</td>
      </tr>
    </tfoot>
  </table>
</nte-data-table>
```

For the MVP, every row must contain the same number of cells and `colspan`/`rowspan` must remain `1`. The table still renders when that contract is not met, but width, hide and pin enhancements are disabled.

## API

- `height`: scroll viewport height; default `24rem`.
- `pinned-columns`: number of the first visible columns pinned to the inline start.
- `scroll-label` or host `aria-label`: accessible name for the keyboard-focusable scroll viewport. A table `aria-label` or caption is used as fallback.
- Header `data-width`, inline CSS `style="width: …"`, or the native `width` attribute sets a fixed column width. Unitless values are treated as pixels.
- Header `hidden` or `data-hidden` hides the complete column.
- `sourceTable`: the active direct Light DOM table.
- `refresh()`: manually reapplies layout metadata. Structural and metadata changes are observed automatically.

The component owns only its `data-nte-data-table-*` markers and the functional table/cell styles needed for sizing, hiding and sticky positioning while connected. Existing inline values are restored when the source table changes or the component disconnects.

The footer is sticky while the table overflows. It is not forced to the viewport bottom when the table has only a few rows.
