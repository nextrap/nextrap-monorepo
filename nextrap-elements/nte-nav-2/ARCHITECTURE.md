# NTE Nav 2 architecture

## Purpose

`nte-nav-2` provides an accessible website-navigation landmark and arranges
`nte-nav-item` elements. Each item owns its native link and, when nested items
exist, a native `details`/`summary` disclosure. Navbar placement, sticky header
behavior, burger controls and offcanvas panels belong to other components.

## Component model

The public DOM is a flat-ish custom-element tree authored by the consumer:

```html
<nte-nav-2 aria-label="Hauptnavigation">
  <nte-nav-item>Produkte
    <nte-nav-item href="/produkte/a">Produkt A</nte-nav-item>
  </nte-nav-item>
</nte-nav-2>
```

Consumers do not author `ul`/`li` wrapper markup. `nte-nav-2` renders the
navigation landmark and the top-level list container in its Shadow DOM.
`nte-nav-item` renders exactly one visual item and optionally one submenu.

Nested `nte-nav-item` children are not cloned or moved to another document
location. The parent item assigns direct nested items to its `submenu` slot,
keeps them as light-DOM children, and renders the submenu inside its own native
`details` element.

## Internal data flow and lifecycle

- `nte-nav-2` forwards its public `aria-label` to the internal `<nav>` and
  exposes `part="nav"` and `part="list"` for theming.
- `nte-nav-item` sets `role="listitem"` by default unless the consumer already
  provided a role.
- The default slot of `nte-nav-item` is the label slot. On every label
  `slotchange`, the item scans only its direct children and assigns nested
  `nte-nav-item` elements to `slot="submenu"`.
- `_hasSubmenu` is derived from direct nested items or the submenu slot content.
  It decides whether the item renders a plain link/text or a
  `details`/`summary` disclosure.
- `_labelText` is derived from non-`nte-nav-item` label nodes and is used only
  for the submenu disclosure's accessible name.
- The `order` property reflects to the host element's inline `order` style so
  Flexbox ordering stays outside the Shadow DOM.

## Link and disclosure invariants

An item with no children renders either an anchor (`href` set) or static text
(`href` omitted). An item with children always uses native `details`/`summary`.

If a parent item also has `href`, the link and disclosure are separate controls:
the anchor keeps normal navigation semantics and the summary toggles the
submenu. If a parent item has no `href`, the whole visible label is the summary
control.

Do not add `menu`, `menubar` or `menuitem` roles. This package models ordinary
website navigation, not an application menu widget.

## Responsive presentation

Authors select horizontal, vertical or responsive presentation through the
package SCSS mixins. The mixins set orientation custom properties on
`nte-nav-2`; those properties are inherited by every nested `nte-nav-item` and
consumed inside item Shadow DOM.

`nte-nav-item` must not define its own horizontal orientation defaults on the
host. Doing so would override inherited vertical values and make vertical
submenus leave inline flow again. Fallbacks belong either on `nte-nav-2` or in
individual `var(..., fallback)` usages that do not mask inherited values.

Horizontal and vertical variations may change only CSS presentation:

- horizontal submenus use normal CSS positioning (`position: absolute`) relative
  to the item and remain inside the same DOM tree;
- vertical submenus use `position: static`, span the available inline size and
  open below the parent in normal `details` flow;
- responsive mode switches only the custom properties at the breakpoint.

The DOM, link semantics and disclosure state remain stable across presentation
changes; the component neither clones nor relocates navigation items.

## Popover invariant

The submenu element must never receive a `popover` attribute, and disclosure
elements must never receive `popovertarget`. Do not call `showPopover()` or
`hidePopover()` from `nte-nav-item`.

This is an intentional architectural constraint, not a missing enhancement.
Enabling Popover moves the submenu into the browser top layer and breaks the
vertical menu's inline expansion. Style variations must therefore preserve the
native `details` state and keep Popover disabled.

Shadow-DOM styles must not include Popover-specific selectors or top-layer
positioning rules such as `[popover]`, `:popover-open`, `position-anchor` or
`overlay` transitions. Keeping those styles out prevents future regressions
where vertical submenus visually pop out even though the markup still looks like
a native disclosure.

Regression tests must verify that opening a submenu leaves both `popover` and
`popovertarget` absent and that no Popover-specific submenu CSS is shipped.
