---
name: nte-data-table-usage
description: "Use @nextrap/nte-data-table to display one native Light DOM table with scrolling, sticky header/footer, fixed or hidden columns, and pinned leading columns."
---

# Nte Data Table Usage

Use this skill for markup and component API. For theme SCSS, use `nte-data-table-theming`.

```ts
import '@nextrap/nte-data-table';
```

```html
<nte-data-table height="30rem" pinned-columns="1" scroll-label="Invoices">
  <table>
    <thead><tr><th data-width="12rem">Invoice</th><th data-width="9rem">Amount</th></tr></thead>
    <tbody><tr><td>2026-001</td><td>€ 120.00</td></tr></tbody>
    <tfoot><tr><td>Total</td><td>€ 120.00</td></tr></tfoot>
  </table>
</nte-data-table>
```

- Provide exactly one direct `<table>` with one header row and at most one footer row.
- Keep all rows rectangular; `colspan` and `rowspan` disable column enhancements.
- Set widths with header `data-width`, inline CSS `style="width: …"`, or `width`; set `hidden`/`data-hidden` on a header to hide that column.
- `pinned-columns` counts the first visible columns. `height` controls the scroll viewport.
- The Light DOM table remains the real interactive table, so use normal table listeners and form controls without event forwarding.
- Mutation/Resize observers update layout automatically; `refresh()` is the manual fallback.
