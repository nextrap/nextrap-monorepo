---
name: nte-navbar-usage
description: "Use @nextrap/nte-navbar to compose multi-line site headers with start, center and end regions. For responsive mobile/desktop navigation, use @trunkjs/element-relocator to move navbar navigation into an off-canvas element and restore it to its original navbar position."
---

# NTE Navbar usage

`<nte-navbar>` is the header wrapper and `<nte-navbar-line>` provides the `start`, `center` and `end` regions. Keep navigation content as normal light-DOM children assigned to these slots.

## Responsive navigation and off-canvas

Navbar itself must not own automatic mobile relocation, breakpoint listeners or off-canvas transfer logic. When navigation belongs in the navbar on desktop but in an off-canvas element on mobile, compose the navbar with `@trunkjs/element-relocator`.

Keep one navigation DOM instance in its canonical desktop navbar position. Put the relocator at the mobile off-canvas destination, select the navigation with `source`, and let `@trunkjs/responsive` add/remove the relocator's `relocated` class. Removing `relocated` restores the navigation to the exact original navbar position.

```html
<nte-navbar>
  <nte-navbar-line>
    <div slot="start" class="brand-logo">...</div>
    <nte-nav-2 id="main-navigation" slot="center">...</nte-nav-2>
    <nte-burger slot="end" class="navbar-control">...</nte-burger>
  </nte-navbar-line>
</nte-navbar>

<nte-offcanvas>
  <tj-element-relocator
    source="#main-navigation"
    placement="after"
    class="-lg:relocated"
  ></tj-element-relocator>
</nte-offcanvas>
```

For Web Components with named slots, prefer `placement="before"` or `placement="after"` when the relocated navigation must remain a light-DOM child of the off-canvas host. Use `inside` only when the extra relocator wrapper is compatible with the destination structure.

This separation is intentional:

- `@nextrap/nte-navbar` owns header geometry, lines, slots, scroll state and navbar presentation.
- `@nextrap/nte-nav-2` owns navigation semantics and submenu behavior.
- `@trunkjs/element-relocator` owns moving and restoring the existing navigation DOM node.
- `@trunkjs/responsive` owns breakpoint-driven activation of `relocated`.
- The off-canvas component owns overlay/disclosure behavior.

Do not render separate desktop and mobile navigation copies when this composition can preserve one navigation instance and its state.
