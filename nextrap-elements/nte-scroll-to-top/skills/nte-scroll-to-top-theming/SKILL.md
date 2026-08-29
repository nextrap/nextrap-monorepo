---
name: nte-scroll-to-top-theming
description: "Theme @nextrap/nte-scroll-to-top and <nte-scroll-to-top> with default-style(), CSS parts, and public custom properties."
---

# NTE Scroll to Top theming

- Include `default-style()` on `nte-scroll-to-top.style-default`; StyleBase supplies its default tokens. See [`index.scss`](../../index.scss).
- Style the public `button` and `icon` parts; do not target Shadow DOM internals.
- Position instances with `--nte-scroll-to-top-offset-block`, `--nte-scroll-to-top-offset-inline`, and `--nte-scroll-to-top-z-index`; control motion with `--nte-scroll-to-top-transition-duration`.
- Keep exactly one `style-*` class on the element. See the [usage skill](../nte-scroll-to-top-usage/SKILL.md).
