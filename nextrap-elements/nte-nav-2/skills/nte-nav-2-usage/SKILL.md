---
name: nte-nav-2-usage
description: "Use @nextrap/nte-nav-2 for site navigation, nested submenus and responsive navigation composition. For mobile/desktop layouts, use @trunkjs/element-relocator to move the same navigation into an off-canvas container and restore it to the navbar instead of duplicating the nav."
---

# NTE Nav 2 usage

Use `<nte-nav-2>` for the actual navigation tree. Consumers author `nte-nav-item` elements directly; do not introduce a parallel `ul/li` navigation tree just for a mobile layout.

## Responsive navbar / off-canvas composition

When the same navigation should live in the navbar on desktop and in an off-canvas element on mobile, prefer `@trunkjs/element-relocator` over rendering two copies of `<nte-nav-2>`.

Place a `<tj-element-relocator>` at the off-canvas destination and point its `source` at the navigation. Let `@trunkjs/responsive` control the relocator's `relocated` class for the desired breakpoint. When `relocated` is removed, the navigation is restored to its exact original navbar position.

Use `placement="before"` or `placement="after"` when the off-canvas Web Component requires the navigation to remain in its light DOM for slot assignment; use the default `inside` when nesting inside the relocator is appropriate.

```html
<nte-navbar>
  <nte-navbar-line>
    <nte-nav-2 id="main-navigation" slot="center" aria-label="Main navigation">
      <!-- nte-nav-item children -->
    </nte-nav-2>
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

The relocator is responsible only for DOM placement. Keep navigation semantics, submenu behavior and orientation in `@nextrap/nte-nav-2`; keep breakpoint interpretation in `@trunkjs/responsive`; keep opening and closing behavior in the off-canvas component.

## Navigation contract

- Do not duplicate the navigation for mobile and desktop when relocation can preserve one DOM instance.
- Horizontal submenus may use `submenu-popover`; vertical inline submenus must not.
- A parent with both `href` and children keeps link and disclosure as separate controls.
- Do not add `menu`, `menubar` or `menuitem` roles to ordinary site navigation.
- Give the navigation an `aria-label` when multiple navigation landmarks exist.
- Test keyboard, touch, focus order and submenu state across relocation and restoration.
