---
name: nte-navbar-usage
description: "Use @nextrap/nte-navbar to compose multi-line site headers with start, center and end regions. Covers CSS-driven static/sticky/fixed placement, scroll collapse/shrink behavior and responsive composition with Nav 2, Burger, Offcanvas and @trunkjs/element-relocator."
---

# NTE Navbar usage

`<nte-navbar>` is the header wrapper and `<nte-navbar-line>` provides the `start`, `center` and `end` regions. Keep navigation content as normal light-DOM children assigned to these slots.

## Placement and scroll behavior

Presentation and layout configuration is CSS-driven. Use `--nte-navbar-position: static|sticky|fixed` for placement and `--nte-navbar-scroll-threshold` for the scroll distance after which the host receives `is-below-threshold`. Do not duplicate these values as HTML attributes.

The component reads JavaScript-relevant CSS configuration from its effective computed style. Changes to the host `class` or `style` attributes automatically trigger a style refresh; `refreshComponentStyle()` is available when an application changes inherited theme values without modifying the host itself.

Lines opt into scroll effects independently:

- `with-collapse-on-scroll` collapses a complete optional line to zero height after the threshold.
- `with-shrink-on-scroll` switches from `--height` to `--height-scrolled` after the threshold.
- `hide-on-scroll` remains a compatibility alias for line collapse.

```html
<nte-navbar
  class="with-transparent-at-top with-shadow-on-scroll"
  style="--nte-navbar-position: sticky; --nte-navbar-scroll-threshold: 12"
>
  <nte-navbar-line class="with-collapse-on-scroll" style="--height: 2.25rem">
    <span slot="start">Service & Support</span>
  </nte-navbar-line>
  <nte-navbar-line class="with-shrink-on-scroll" style="--height: 5.5rem; --height-scrolled: 4rem">
    ...
  </nte-navbar-line>
</nte-navbar>
```

`with-transparent-at-top` removes the navbar background and shadow until the scroll threshold is crossed. `with-shadow-on-scroll` adds elevation below the threshold; `with-shadow` keeps it permanently. `with-overlay-at-top` can be combined with `--nte-navbar-overlay-offset` when the top state must overlap following content.

## Responsive navigation and off-canvas

Navbar itself must not own breakpoint listeners, media queries, automatic mobile relocation or off-canvas transfer logic. When navigation belongs in the navbar on desktop but in an off-canvas element on mobile, compose the navbar with `@trunkjs/element-relocator` and `@trunkjs/responsive`.

Keep one navigation DOM instance in its canonical desktop navbar position. Put the relocator at the mobile off-canvas destination, select the navigation with `source`, and let TrunkJS Responsive add/remove the relocator's `relocate` class. Removing `relocate` restores the navigation to the exact original navbar position. Use responsive `style-*` directives to switch CSS Custom Properties such as the Nav 2 flow instead of `matchMedia` or component media queries.

```html
<tj-responsive>
  <nte-navbar style="--nte-navbar-position: sticky">
    <nte-navbar-line>
      <div slot="start" class="brand-logo">...</div>
      <nte-nav-2
        id="main-navigation"
        slot="end"
        style="--nte-nav-flow: column"
        style-lg="--nte-nav-flow: row"
      >...</nte-nav-2>
      <nte-burger slot="end" aria-controls="site-menu" style="display:block" style-lg="display:none"></nte-burger>
    </nte-navbar-line>
  </nte-navbar>

  <nte-offcanvas id="site-menu">
    <tj-element-relocator source="#main-navigation" placement="after" class="-lg:relocate"></tj-element-relocator>
  </nte-offcanvas>
</tj-responsive>
```

For Web Components with named slots, prefer `placement="before"` or `placement="after"` when the relocated navigation must remain a light-DOM child of the off-canvas host. Use `inside` only when the extra relocator wrapper is compatible with the destination structure.

This separation is intentional:

- `@nextrap/nte-navbar` owns header geometry, lines, slots, scroll state and navbar presentation.
- `@nextrap/nte-nav-2` owns navigation semantics and submenu behavior.
- `@trunkjs/element-relocator` owns moving and restoring the existing navigation DOM node.
- `@trunkjs/responsive` owns breakpoint-driven classes and styles.
- The off-canvas component owns overlay/disclosure behavior.

Do not render separate desktop and mobile navigation copies when this composition can preserve one navigation instance and its state.
