# NTE Nav 2 architecture

## Purpose

`nte-nav-2` provides an accessible website-navigation landmark and arranges
`nte-nav-item` elements. Each item owns its native link and, when nested items
exist, a native `details`/`summary` disclosure. Navbar placement, sticky header
behavior, burger controls and offcanvas panels belong to other components.

## Responsive presentation

Authors select horizontal, vertical or responsive presentation through the
package SCSS mixins. Orientation custom properties are owned by `nte-nav-2` and
inherited by every nested `nte-nav-item`; an item must not replace inherited
orientation values with local horizontal defaults.

- Horizontal submenus use a native Popover in the top layer.
- Vertical submenus remain in normal document flow and expand below their
  parent item through the native `details` state.

CSS cannot move an already open Popover out of the browser's top layer. The
item therefore synchronizes presentation in JavaScript: before entering the
vertical mode it calls `hidePopover()` when necessary and removes the
`popover` attribute while preserving the open `details` state. When returning
to horizontal mode, an open disclosure may be promoted to a Popover again.

The DOM, link semantics and disclosure state remain stable across mode changes;
the component neither clones nor relocates navigation items.
