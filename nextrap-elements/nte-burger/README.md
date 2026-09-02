# NTE Burger

An accessible responsive disclosure button for navigation menus.

Use `static-state` when the burger should remain visually closed while its
click event controls an external disclosure such as an offcanvas:

```html
<nte-burger
  aria-label="Open navigation"
  aria-controls="navigation-drawer"
  static-state
  onclick="document.getElementById('navigation-drawer')?.toggle()"
></nte-burger>
```

In this mode the component still emits its normal click event, but does not
change `open` or `aria-expanded`. See the packaged
[`nte-burger-usage`](skills/nte-burger-usage/SKILL.md) skill and the demos for
the complete public API and examples.
