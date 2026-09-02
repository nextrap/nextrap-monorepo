---
name: nte-nav-usage
description: "Use @nextrap/nte-nav for site navigation, nested submenus and responsive navigation composition. For mobile/desktop layouts, use @trunkjs/element-relocator with separate horizontal and vertical navigation elements; it moves the navigation items between them instead of displaying two filled copies."
---

# NTE Nav 2 usage

Use `<nte-nav>` for the actual navigation tree. Consumers author `nte-nav-item` elements directly; do not introduce a parallel `ul/li` navigation tree just for a mobile layout.

## Responsive navbar / off-canvas composition

When navigation should live in the navbar on desktop but in an off-canvas element on mobile, author separate horizontal and vertical `<nte-nav>` elements. Place a `<tj-element-relocator>` at the off-canvas destination and point its `source` and `target` at the two navigations. Let `@trunkjs/responsive` control the relocator's `relocate` class. When `relocate` is removed, the items move back to the horizontal source navigation.

Use `source` and `target` selectors for navbar-to-off-canvas relocation. The relocator moves the `nte-nav-item` children between the two navigation elements and does not transfer `slot` attributes. `placement` is not supported.

```html
<nte-navbar>
  <nte-navbar-line>
    <nte-nav id="main-navigation-horizontal" slot="end" aria-label="Main navigation">
      <!-- nte-nav-item children -->
    </nte-nav>
  </nte-navbar-line>
</nte-navbar>

<nte-offcanvas>
  <nte-nav id="main-navigation-vertical" aria-label="Mobile navigation"></nte-nav>
  <tj-element-relocator
    source="#main-navigation-horizontal"
    target="#main-navigation-vertical"
    class="-lg:relocate"
  ></tj-element-relocator>
</nte-offcanvas>
```

The relocator is responsible only for moving the navigation items. Keep navigation semantics, submenu behavior and orientation in `@nextrap/nte-nav`; keep breakpoint interpretation in `@trunkjs/responsive`; keep opening and closing behavior in the off-canvas component.

## Navigation contract

- Use separate horizontal and vertical `nte-nav` elements when the navigation must move between a navbar and an off-canvas.
- The source navigation is empty while `relocate` is active and the target contains the items.
- Horizontal submenus may use `submenu-popover`; vertical inline submenus must not.
- A parent with both `href` and children keeps link and disclosure as separate controls.
- Do not add `menu`, `menubar` or `menuitem` roles to ordinary site navigation.
- Give the navigation an `aria-label` when multiple navigation landmarks exist.
- Test keyboard, touch, focus order and submenu state across relocation and restoration.
