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
- The configured `height` applies to `tbody`; the body viewport therefore determines the table's scrollable height.
- The Shadow DOM viewport and the table itself must not become competing scroll containers.
- The Shadow DOM viewport is only the non-scrolling slot and layout shell; it must not draw synthetic scroll tracks or thumbs.
- `caption`, `thead`, `tbody`, and `tfoot` remain in normal document order; header and footer must not be absolutely positioned or emulated with body padding.
- Because the native scrollbars belong only to `tbody`, they start below `thead` and end above `tfoot` and cannot be covered by either section.
- JavaScript observes `tbody` scroll events and mirrors its horizontal offset to `thead` and `tfoot` with transforms. Vertical scrolling needs no section offset because header and footer remain outside the body scroll viewport.

## Border ownership contract

- The `nte-data-table` host is the only owner of the component's outer border and border radius.
- The viewport, native table, caption, sections, rows, and cells must not draw a border or radius along the table's top, inline-start, inline-end, or bottom outer edge.
- Themes may draw separators only between cells and sections. Removing the host border must therefore leave the complete table without an accidental outer border.

## Column layout contract

- JavaScript resolves every visible column to one concrete pixel width and applies that width to the corresponding header, body, and footer cells.
- The sum of the effective visible column widths must be at least the usable `tbody` viewport width. If the natural/configured widths are smaller, JavaScript adds the exact remainder to the last visible column for that layout pass.
- This fill width is derived and must not overwrite the last column's configured width. Recomputing it on resize keeps all sections aligned without inventing a separate background or divider surface.
- Header `data-width`, inline `width`, and the native `width` attribute are accepted as width inputs.
- Pointer resizing starts only at a header cell's inline-end separator and writes the result back to `data-width`.
- The minimum resizable width is 48 pixels.
- Header and footer cells remain single-line so indicators and controls cannot change section height or break cross-section alignment.
- Hidden columns are derived from the corresponding header cell and hidden consistently in every section.
- Rows must remain rectangular; `colspan` and `rowspan` are outside the enhanced layout contract.

## Native table normalization

- The component always resets margin and padding on its direct native table because host-page content styles commonly add table margins that would otherwise shift or enlarge the component layout.
- Internal cell separators remain visible, including the block-end border of the last `tbody` row. This line deliberately separates the final data row from unused white body viewport space.
- Header and footer backgrounds and their body-facing divider lines reach the viewport end through the minimum-width column calculation, not through cloned elements, generated filler cells, or independent overlay backgrounds.

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
4. Configure `tbody` with the requested height as the only scroll container and read its usable viewport width.
5. Expand the last visible column when necessary, then apply identical effective pixel widths across all table sections.
6. Keep caption/header/footer in normal flow and apply cumulative pinned-column offsets.
7. Attach the body scroll listener and synchronize the current header/footer horizontal transforms.
8. Reconnect permitted size observation.

All component-owned inline styles and `data-nte-data-table-*` markers must be restored when the source table changes or the component disconnects.

## Change rule

A future change may optimize the implementation, but it must preserve every contract above. Any deliberate architecture change requires explicit maintainer approval and an update to this document, the package usage skill, the demos, and the relevant tests in the same pull request.
