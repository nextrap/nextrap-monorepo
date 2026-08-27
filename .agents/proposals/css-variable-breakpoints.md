# CSS variables for breakpoints

**Status:** Blocked until CSS custom properties can be used interoperably in media or container query conditions.

- Target: Define shared breakpoint values once as `--nt-*` variables and reuse them directly in conditional rules.
- → Simplifies: responsive `ntl-*` layouts, especially `ntl-2col` and `ntl-card-row`, by removing duplicated breakpoint literals.
- Not covered: `var()` cannot currently supply the condition value of `@media` or `@container`; the Sass/build-time fallback therefore remains necessary.
- Review: Recheck browser support and the relevant CSS specification before the next major cleanup. Migrate only when all supported browsers behave consistently.
