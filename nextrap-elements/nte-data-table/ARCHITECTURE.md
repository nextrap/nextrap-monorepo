# NTE Data Table Architecture Contract

This is the binding internal contract for `@nextrap/nte-data-table`. Changes require explicit maintainer approval. This file is not published.

## Layering

- `nte-data-table` composes exactly one internal `nte-table` and one native table.
- Dependency direction is editable data table → data table → table.
- This package never duplicates scrolling, fixed-width layout, pinning, resize gestures or DOM reorder mechanics from `nte-table`.
- `nte-table` remains unaware of row objects, definitions and user state.
- A future `nte-editable-data-table` owns editors, validation, drafts and mutation adapters in its own `ARCHITECTURE.md`.

## Data and definition

- `data` is a caller-owned readonly array. Rendering never mutates row objects.
- `TableDefinition` is developer-controlled and defines stable unique column IDs, accessors, renderers, presets and capabilities.
- Row and column identity must be stable across refreshes.
- Renderer strings are text, not HTML. A renderer may deliberately return a Node.

## View state

- `TableViewState` contains only user-variable order, widths, visibility, pinning and sorting.
- Every column reference uses its stable ID, never a transient DOM index.
- Resize, reorder and sort events from `nte-table` are translated into a new immutable state and one `nte-data-table-view-state-change` event.
- The component owns no localStorage, network or database persistence. Applications or later adapters persist emitted state.

## Editing boundary

Dataset editing, dirty state, validation, commit/cancel and persistence mutations are forbidden here and belong to `nte-editable-data-table`.
