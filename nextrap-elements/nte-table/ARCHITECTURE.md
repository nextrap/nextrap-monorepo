# NTE Table Architecture Contract

This document is internal source-project guidance and the binding implementation contract for `@nextrap/nte-table`. It is not public package usage documentation and must not be published with the npm package.

Read it before changing the component's DOM, scrolling, column sizing, pinning, or resize behavior. The architecture must remain intact unless the developer explicitly approves a replacement. Editing, moving, renaming, or deleting this file itself also requires explicit developer approval; general approval for feature work, fixes, or refactoring is not sufficient.

## Component family

- `@nextrap/nte-table` and `<nte-table>` are the native-table foundation. They enhance exactly one caller-owned Light DOM `<table>` with layout, scrolling, column sizing, pinning, selection and opt-in interaction plugins. This package does not create rows from application data and owns no application data model, table schema, editing workflow or persistence adapter.
- A future `@nextrap/nte-data-table` / `<nte-data-table>` package composes `nte-table`. It owns creation and reconciliation of the native table from row data, a developer-controlled `TableDefinition` and a serializable `TableViewState`. It must reuse this package for native-table presentation instead of duplicating its layout contracts.
- A future `@nextrap/nte-editable-data-table` / `<nte-editable-data-table>` package builds on `nte-data-table`. It owns editors, drafts, validation, commit/cancel behavior and mutation events or adapters. It must not make the lower-level `nte-table` responsible for application data or database persistence.
- Dependency direction is strictly from the higher-level components to the lower-level components: editable data table → data table → table. Lower levels must not import or special-case higher levels.
- Every package in this family has its own package-local `ARCHITECTURE.md`. A higher-level architecture document defines only its additional responsibilities and integration with the level below; it does not replace or weaken the lower-level contract. A change spanning levels must update every affected architecture document in the same pull request and requires the normal explicit architecture approval.

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

- The `nte-table` host is the only owner of the component's outer border and border radius.
- The viewport, native table, caption, sections, rows, and cells must not draw a border or radius along the table's top, inline-start, inline-end, or bottom outer edge.
- Themes may draw separators only between cells and sections. Removing the host border must therefore leave the complete table without an accidental outer border.

## Column layout contract

- JavaScript resolves every visible column to one concrete pixel width and applies that width to the corresponding header, body, and footer cells.
- Real column widths remain independent from viewport fill. Resizing or reordering one column must never implicitly change the width of whichever real column happens to be last.
- Each rendered row uses a non-semantic `::after` table-cell as a visual filler. The row width is at least the usable `tbody` viewport width, so the filler alone absorbs any remainder after the real fixed-width cells.
- The filler must remain a CSS pseudo-element: it must not appear in `row.cells`, accessibility semantics, selection, sorting, pinning, resizing, or column-reorder logic. When real columns exceed the viewport, it collapses and native horizontal scrolling takes over.
- Header `data-width`, inline `width`, and the native `width` attribute are accepted as width inputs.
- Pointer resizing starts only at a header cell's inline-end separator and writes the result back to `data-width`.
- The minimum resizable width is 48 pixels.
- Header and footer cells remain single-line so indicators and controls cannot change section height or break cross-section alignment.
- Hidden columns are derived from the corresponding header cell and hidden consistently in every section.
- Rows must remain rectangular; `colspan` and `rowspan` are outside the enhanced layout contract.

## Native table normalization

- The component always resets margin and padding on its direct native table because host-page content styles commonly add table margins that would otherwise shift or enlarge the component layout.
- Internal cell separators remain visible, including the block-end border of the last `tbody` row. This line deliberately separates the final data row from unused white body viewport space.
- Header, body, and footer filler cells inherit their section background and body-facing divider so short tables still reach the viewport edge. When a filler has positive remaining width, it also draws an inset inline-start separator from the final real cell. The separator must not contribute layout width: a collapsed filler must remain invisible and must not create an outer table border. No real or cloned DOM cell may be added for this presentation-only space.

## Pinned-column contract

- `pinned-columns` counts the first visible columns.
- Each pinned cell in `thead`, `tbody`, and `tfoot` receives `position: sticky` and a measured cumulative inline-start offset.
- Body cells remain fixed through native sticky positioning inside the scrolling `tbody`.
- Header and footer sections follow the horizontal scroll transform; their pinned cells receive the inverse transform so they remain fixed.
- Column hiding and resizing must always trigger recalculation of all following pin offsets.

## Reorder interaction contract

- Row and column reordering uses Pointer Events, not native HTML drag-and-drop. This provides one controlled interaction model for mouse, pen, and touch and permits deterministic previews and animation.
- Dragging starts only from the plugin handle. A non-semantic, `aria-hidden` neutral-gray ghost follows the pointer above the document. It visualizes the dragged extent without cloning cell content or computed styles.
- The ghost geometry is the union of only the visible intersections of the supplied element rectangles. Row cells are clipped to the `tbody` viewport and browser viewport; column body cells are clipped to `tbody`, while header/footer cells are clipped to the component host, and all are clipped to the browser viewport. Off-screen parts of very long rows or columns must never enlarge the ghost.
- The original row or source-column cells remain in the native table with `visibility: hidden`; they are the exact-size placeholder and must keep the table geometry stable. Do not insert synthetic placeholder rows or cells into the table DOM.
- Crossing another row or column previews the new order immediately in the real Light DOM. Displaced rows/cells animate from their previous rectangles to their new rectangles with a short FLIP transition.
- Column targeting compares the drag ghost's center only with the immediately adjacent column in the current pointer direction. The center must cross that neighbor's midpoint plus a bounded hysteresis before a swap occurs. Pointer moves are coalesced to one layout decision per animation frame, and the opposite direction is ignored for the duration of the current FLIP transition. These rules prevent live DOM remeasurement from repeatedly swapping equal-width or differently sized columns around the same boundary; do not replace them with a general pre-swap timeout.
- Pointer cancellation or plugin disconnection restores the exact original element order. A successful pointer release emits the existing reorder event once with the original and final indices, then calls the normal component refresh lifecycle.
- Edge auto-scroll may change only `tbody.scrollTop` for rows and `tbody.scrollLeft` for columns. The overlay is presentation-only and must never participate in selection, sorting, pinning, resizing, events, or accessibility semantics.
- `createDragGhost` deliberately accepts an element list plus a clipping rectangle (or per-element clipping function), so its measurement and presentation logic can later move to a higher-level or shared library repository when a second consumer establishes the reusable API. The complete drag-and-drop flow stays table-specific for now: reorder indices, Light-DOM placeholders, FLIP moves, body auto-scroll, rollback, and component events are coupled to this table's contract, so a broader helper would add abstraction without a proven shared behavior.

## Layout lifecycle

1. Restore only styles/attributes previously owned by the component.
2. Validate the single table, single header row, single body, optional single footer row, and rectangular rows.
3. Read configured widths and measure unresolved header widths.
4. Configure `tbody` with the requested height as the only scroll container and read its usable viewport width.
5. Apply identical real pixel widths across all table sections and size each row to at least the body viewport so its CSS filler receives the remainder.
6. Keep caption/header/footer in normal flow and apply cumulative pinned-column offsets.
7. Attach the body scroll listener and synchronize the current header/footer horizontal transforms.
8. Reconnect permitted size observation.

All component-owned inline styles and `data-nte-table-*` markers must be restored when the source table changes or the component disconnects.

## Change rule

A future change may optimize the implementation, but it must preserve every contract above. Any deliberate architecture change requires explicit maintainer approval and an update to this document, the package usage skill, the demos, and the relevant tests in the same pull request.
