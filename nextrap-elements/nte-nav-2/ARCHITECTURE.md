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

All submenu variations use the same native `details`/`summary` disclosure and
remain in normal document flow. Horizontal and vertical variations may change
only the submenu's CSS presentation; they must not replace its interaction
model or move it into the browser's top layer.

## Popover invariant

The submenu element must never receive a `popover` attribute, and disclosure
elements must never receive `popovertarget`. Do not call `showPopover()` or
`hidePopover()` from `nte-nav-item`.

This is an intentional architectural constraint, not a missing enhancement.
Enabling Popover moves the submenu into the top layer and breaks the vertical
menu's inline expansion. Style variations must therefore preserve the native
`details` state and keep Popover disabled.

A regression test must verify that opening a submenu leaves both `popover` and
`popovertarget` absent.

The DOM, link semantics and disclosure state remain stable across presentation
changes; the component neither clones nor relocates navigation items.
