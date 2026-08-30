---
name: nte-data-table-theming
description: "Theme @nextrap/nte-data-table through its composed nte-table and default-style Sass entry point."
---

# NTE Data Table Theming

- The generated native table is presented by the inner `nte-table`; use the public `@nextrap/nte-table` theming contract for cells, headers, states and plugin controls.
- `@nextrap/nte-data-table/default` includes the table default.
- Do not target the outer Shadow DOM internals or duplicate table layout rules.
- Data renderers may return deliberate Nodes for semantic content; instance-specific presentation belongs in renderer output or application classes.

See `../nte-data-table-usage/SKILL.md` and `demo/01-data.demo.ts`.
