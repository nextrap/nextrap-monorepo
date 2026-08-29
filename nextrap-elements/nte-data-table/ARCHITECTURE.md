# NTE Data Table Architecture Contract

This document is internal source-project guidance and the binding implementation contract for `@nextrap/nte-data-table`. It is not public package usage documentation and must not be published with the npm package.

Read it before changing the component's DOM, scrolling, column sizing, pinning, or resize behavior. The architecture must remain intact unless the developer explicitly approves a replacement. Editing, moving, renaming, or deleting this file itself also requires explicit developer approval; general approval for feature work, fixes, or refactoring is not sufficient.

## Core model

- The direct Light DOM `<table>` is the only table and remains the visible, interactive source of truth.
- Never observe the table with a `MutationObserver`.
- Never copy or clone the table or any of its contents into Shadow DOM.
- Shadow DOM provides only the non-scrolling viewport shell and the slot.
- Native table events, focus, form controls, framework bindings, and DOM mutations therefore continue to work directly.

## Scrolling contract

- `tbody` is the only vertical and horizontal scroll container.
- The Shadow DOM viewport and the table itself must not become competing scroll containers.
- The Shadow DOM viewport is only the non-scrolling slot and layout shell; it must not draw synthetic scroll tracks or thumbs.
- `thead` and `tfoot` are positioned absolutely above and below the body.
- JavaScript measures header and footer heights and reserves those heights as block padding inside `tbody`.
- The footer stays at the component's block end without an additional synthetic scrollbar strip or bottom offset.
- Horizontal body scrolling is mirrored to `thead` and `tfoot` with transforms.

## Border ownership contract

- The `nte-data-table` host is the only owner of the component's outer border and border radius.
- The viewport, native table, caption, sections, rows, and cells must not draw a border or radius along the table's top, inline-start, inline-end, or bottom outer edge.
- Themes may draw separators only between cells and sections. Removing the host border must therefore leave the complete table without an accidental outer border.

## Column layout contract

- JavaScript resolves every visible column to one concrete pixel width and applies that width to the corresponding header, body, and footer cells.
- Header `data-width`, inline `width`, and the native `width` attribute are accepted as width inputs.
- Pointer resizing starts only at a header cell's inline-end separator and writes the result back to `data-width`.
- The minimum resizable width is 48 pixels.
- Hidden columns are derived from the corresponding header cell and hidden consistently in every section.
- Rows must remain rectangular; `colspan` and `rowspan` are outside the enhanced layout contract.

## Pinned-column contract

- `pinned-columns` counts the first visible columns.
- Each pinned cell in `thead`, `tbody`, and `tfoot` receives `position: sticky` and a measured cumulative inline-start offset.
- Body cells remain fixed through native sticky positioning inside the scrolling `tbody`.
- Header and footer sections follow the horizontal scroll transform; their pinned cells receive the inverse transform so they remain fixed.
- Column hiding and resizing must always trigger recalculation of all following pin offsets.

## Layout lifecycle

1. Restore only styles/attributes previously owned by the component.
2. Validate the single table, single header row, single body, optional single footer row, and rectangular rows.
3. Read configured widths and measure unresolved header widths.
4. Apply identical fixed pixel widths across all table sections.
5. Position header/footer and configure `tbody` as the only scroll container.
6. Measure and reserve header, footer, and horizontal-scrollbar space.
7. Apply cumulative pinned-column offsets.
8. Reconnect permitted size observation and synchronize the current horizontal scroll position.

All component-owned inline styles and `data-nte-data-table-*` markers must be restored when the source table changes or the component disconnects.

## Change rule

A future change may optimize the implementation, but it must preserve every contract above. Any deliberate architecture change requires explicit maintainer approval and an update to this document, the package usage skill, the demos, and the relevant tests in the same pull request.
