# NTE Data Table Architecture Contract

This document is internal source-project guidance and the binding implementation contract for `@nextrap/nte-data-table`. It is not public package usage documentation and must not be published with the npm package.

Read it before changing the component's DOM, scrolling, column sizing, pinning, or resize behavior. The architecture must remain intact unless the developer explicitly approves a replacement. Editing, moving, renaming, or deleting this file itself also requires explicit developer approval; general approval for feature work, fixes, or refactoring is not sufficient.

## Core model

- The direct Light DOM `<table>` is the only table and remains the visible, interactive source of truth.
- Never clone the table into Shadow DOM and never add an event-forwarding bridge.
- Shadow DOM provides only the non-scrolling viewport shell and the slot.
- Native table events, focus, form controls, framework bindings, and DOM mutations therefore continue to work directly.

## Scrolling contract

- `tbody` is the only vertical and horizontal scroll container.
- The Shadow DOM viewport and the table itself must not become competing scroll containers.
- `thead` and `tfoot` are positioned absolutely above and below the body.
- JavaScript measures header and footer heights and reserves those heights as block padding inside `tbody`.
- The horizontal scrollbar remains part of `tbody`; the footer is offset above it.
- Horizontal body scrolling is mirrored to `thead` and `tfoot` with transforms.

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

1. Disconnect observers and restore only styles/attributes previously owned by the component.
2. Validate the single table, single header row, single body, optional single footer row, and rectangular rows.
3. Read configured widths and measure unresolved header widths.
4. Apply identical fixed pixel widths across all table sections.
5. Position header/footer and configure `tbody` as the only scroll container.
6. Measure and reserve header, footer, and horizontal-scrollbar space.
7. Apply cumulative pinned-column offsets.
8. Reconnect Mutation/Resize observers and synchronize the current horizontal scroll position.

All component-owned inline styles and `data-nte-data-table-*` markers must be restored when the source table changes or the component disconnects.

## Change rule

A future change may optimize the implementation, but it must preserve every contract above. Any deliberate architecture change requires explicit maintainer approval and an update to this document, the package usage skill, the demos, and the relevant tests in the same pull request.
