# Typed `attr()` for integer columns

**Status:** Blocked until typed integer attributes are interoperable in Safari and Firefox.

- Target: Read `cols` directly in CSS with typed `attr()` and use the integer in grid or flex calculations.
- → Simplifies: `ntl-card-row`, because row and card column widths could be configured through attributes without mirroring them into CSS variables.
- Not covered: reliable `type(<integer>)` parsing, use in calculations, and consistent fallback handling across all supported browsers.
- Review: Recheck Safari and Firefox support before a later cleanup release. Replace the CSS-variable API only after cross-browser demos and existing component tests pass.
