# NTE Offcanvas Architecture

## Purpose

`nte-offcanvas` is a generic edge-attached or fullscreen surface component. It is not limited to navigation drawers. Its job is to present substantial application content from a viewport edge or across the full viewport and coordinate how that surface affects the remaining page.

The component should support four edges (`left`, `right`, `top`, `bottom`), a dedicated `fullscreen` presentation mode, and two fundamental layout strategies (`overlay`, `push`) for edge-attached variants. Modal interaction and backdrops are orthogonal behaviors that can be enabled where appropriate.

This document defines the intended application areas and behavioral model. The concrete public API is intentionally left open until the architecture has been agreed.

## Primary application areas

### Side navigation and utility panels

A surface enters from the left or right while the underlying page remains visible.

Typical examples:

- main or secondary navigation
- application sidebar on small viewports
- filters and faceted search
- shopping cart / basket
- detail or inspector panel
- contextual tools and settings
- table or dashboard controls

Two layout strategies must be possible:

- **Overlay:** the offcanvas surface is placed above the page content.
- **Push:** the offcanvas surface consumes layout space and reduces/shifts the available page area instead of covering it.

### Top and bottom surfaces

A surface enters from the top or bottom edge.

Typical examples:

- cookie and consent banners
- announcements and notices
- persistent action bars
- mobile navigation or tool sheets
- contextual status or warning surfaces
- promotional or informational banners

These surfaces also support both layout strategies:

- **Overlay:** the surface covers part of the viewport/content.
- **Push:** the surface reserves space so the document remains fully reachable and can be scrolled to its actual end while the surface is open.

A bottom or top surface may therefore behave as a permanently attached edge element without being modal.

### Fullscreen surfaces

`nte-offcanvas` should additionally support a dedicated fullscreen mode.

Fullscreen is conceptually close to a dialog, but belongs in the offcanvas system because it represents the same class of substantial application surface, uses the same lifecycle/coordination rules, and may be opened by the same controls and navigation flows.

Typical examples:

- fullscreen main navigation
- mobile mega navigation
- immersive application navigation
- full-viewport search or command surfaces
- multi-step navigation or application workflows that should temporarily replace the visible page

Fullscreen should normally occupy the complete available viewport/application surface and should participate in global offcanvas exclusivity. Unlike edge-attached variants, `push` is not meaningful for fullscreen; fullscreen is inherently a replacing/overlaying presentation.

## Navigation integration

A primary application area of `nte-offcanvas` is hosting Nextrap navigation components.

The architecture must explicitly maintain compatibility with **NTE Nav 2**, which is expected to become the future **NTE Nav** component.

In particular, it must be possible to use NTE Nav as the content of:

- a left or right overlay navigation drawer
- a left or right push navigation sidebar
- a top or bottom navigation surface where appropriate
- a fullscreen primary/main navigation

`nte-offcanvas` must therefore avoid assumptions about its slotted content that would interfere with NTE Nav's own layout, focus handling, submenu logic, responsive behavior, events, or internal stacking.

The integration contract should favor composition: `nte-offcanvas` owns surface placement, opening/closing, modality, backdrop, page displacement and arbitration; NTE Nav owns navigation structure and navigation-specific interaction.

## Behavioral dimensions

The architecture should treat the following dimensions independently wherever possible.

### Placement

An offcanvas uses one of the following placements/presentations:

- `left`
- `right`
- `top`
- `bottom`
- `fullscreen`

For edge-attached surfaces, animation direction and layout effects derive from the edge. Fullscreen uses a dedicated viewport-covering presentation and animation policy.

### Layout strategy

Two primary strategies exist for edge-attached surfaces.

#### Overlay

The surface does not change the available layout space of the page. It enters above existing content.

This is suitable for transient navigation, inspectors, carts and modal interactions.

#### Push

The surface participates in the effective page layout and reduces the space available to the main content.

For left/right surfaces this shifts or constrains the body/application content horizontally.

For top/bottom surfaces this reserves vertical space. In particular, a bottom push surface must not permanently cover the end of the document; users must still be able to scroll all page content into view.

Fullscreen does not use `push`; it occupies the full available viewport/application surface.

### Interaction mode

Interaction blocking is separate from placement and layout strategy.

An offcanvas can be:

- **non-modal:** the remaining page stays interactive.
- **modal:** interaction outside the surface is blocked.

A modal surface may optionally use a backdrop. The standard backdrop should follow Nextrap's visual language: animated, darkened and blurred. Backdrop appearance must remain themeable.

Modal behavior is expected to include proper focus handling, keyboard dismissal rules where allowed, scroll handling and inaccessible/inert background content.

Fullscreen surfaces will commonly be modal, but the architecture should not hard-code fullscreen and modality as the same concept unless a later decision explicitly requires it.

### Backdrop

Backdrop behavior must not define whether the offcanvas is overlay or push. For example, a push layout can still temporarily lock interaction if required.

The backdrop should therefore be modeled as an interaction/presentation option rather than as a layout mode.

## Multiple offcanvas instances

A page may contain many `nte-offcanvas` elements.

### Edge ownership

By default, only one offcanvas may be open for a given edge at a time.

Opening another element assigned to the same edge should request the currently open element to close before the new one becomes active.

Different edges are independent. For example, a left surface and a bottom surface may coexist unless another policy explicitly prevents it.

Fullscreen is not treated as another independent edge. A fullscreen offcanvas participates in global arbitration and should not coexist with another active offcanvas unless a future explicit stacking policy allows it.

Likewise, opening a fullscreen offcanvas should request currently active replaceable offcanvas surfaces to close before fullscreen becomes active.

### Priority / lock

An active offcanvas can acquire a lock for its arbitration scope. While locked, another offcanvas that would conflict with it cannot replace it.

This is intended for surfaces that must remain authoritative until an explicit condition is fulfilled, for example:

- mandatory consent flows
- critical confirmation or transactional steps
- unsaved editor/tool state
- application states where replacement would be destructive or confusing
- a primary fullscreen navigation/workflow that must not be interrupted by another offcanvas request

The coordination layer must distinguish between normal close requests and forced/internal teardown. A lock must not make lifecycle cleanup impossible.

### Coordination instead of DOM assumptions

Multiple instances should be coordinated through a dedicated offcanvas manager/controller or equivalent shared mechanism. Components should not locate and manipulate arbitrary sibling instances directly through document queries.

The coordination mechanism is responsible for:

- tracking the active surface for each edge
- tracking a fullscreen/global surface
- handling replacement requests
- respecting locks/priorities
- serializing close/open transitions where necessary
- avoiding animation races

Whether this manager lives in the framework layer or inside the package remains an implementation decision.

## Stacking

"One open element per edge" is the default arbitration rule and is different from visual `z-index` stacking.

The architecture should still allow a well-defined global layer order so an offcanvas can coexist predictably with dialogs, toasts, popovers and other application surfaces.

Fullscreen belongs to the offcanvas arbitration system but visually occupies a higher/global surface role than an ordinary edge-attached offcanvas.

Nested or deliberately stacked offcanvas surfaces are not a primary use case. They should only be introduced later if a concrete requirement cannot be represented by independent edges, fullscreen, or another surface type.

## Expected use-case matrix

| Use case | Placement | Typical layout | Typical interaction |
| --- | --- | --- | --- |
| Main navigation | left/right | overlay or push | non-modal or modal |
| Fullscreen main navigation | fullscreen | fullscreen/overlay | usually modal |
| Filters | left/right | overlay | usually modal on small screens |
| Cart | right | overlay | modal or non-modal |
| Inspector/details | left/right | push or overlay | usually non-modal |
| Application sidebar | left/right | push | non-modal |
| Cookie/consent | bottom/top | push or overlay | optionally modal/locked |
| Announcement | top/bottom | push | non-modal |
| Persistent action bar | bottom | push | non-modal |
| Mobile tool sheet | bottom | overlay | often modal |
| Fullscreen search/command surface | fullscreen | fullscreen/overlay | usually modal |
| Critical workflow surface | any edge/fullscreen | overlay, push or fullscreen | modal and optionally locked |

## Additional application areas to keep in scope

The same architecture naturally covers several cases beyond navigation and cookie banners:

- **responsive desktop/mobile sidebars:** a push sidebar on desktop can use the same conceptual surface as an overlay drawer or fullscreen navigation on mobile.
- **master-detail / inspector UI:** selecting an item opens a persistent detail pane without navigating away.
- **filter and search panels:** especially useful when switching between push and modal overlay behavior at breakpoints.
- **shopping carts and checkout summaries:** transient right-side surfaces with optional interaction blocking.
- **command/help/settings surfaces:** contextual application tools that should not require a centered dialog.
- **persistent status/action regions:** upload progress, media controls, bulk-selection actions or workflow controls attached to top/bottom.
- **system notices requiring acknowledgement:** an edge surface can be locked and modal without necessarily behaving like a centered dialog.
- **fullscreen application navigation:** NTE Nav can occupy the entire viewport while remaining part of the same offcanvas lifecycle and arbitration system.

## Cases that should probably remain separate components

`nte-offcanvas` should not become a universal floating-surface abstraction.

The following are better represented by dedicated primitives unless future requirements demonstrate otherwise:

- ordinary centered dialogs and alert dialogs
- small anchored popovers and menus
- tooltips
- transient toast notifications
- fully draggable/resizable floating windows

Fullscreen is intentionally an exception to the otherwise edge-attached definition because it is needed as a first-class presentation for navigation and other large application surfaces and benefits from the same offcanvas coordination model.

The defining characteristic of `nte-offcanvas` should therefore remain: **a substantial application surface attached to a viewport/application edge or occupying it entirely, whose opening may overlay, replace, or alter the available page space and whose lifecycle is coordinated with other offcanvas surfaces.**

## Open architecture questions

The following questions should be decided before finalizing the public API:

1. Is arbitration strictly per edge plus fullscreen/global arbitration, or do we additionally need named channels/groups independent of placement?
2. Can multiple different edges be modal simultaneously, or should modal mode introduce a global exclusivity rule?
3. Should `push` modify the document/body directly or require an explicit layout/container target?
4. Should responsive mode changes (for example push on desktop, overlay or fullscreen on mobile) be built into `nte-offcanvas` or handled externally through CSS/application state?
5. What exactly does a lock prevent: competing opens only, dismissal by backdrop/Escape, programmatic close, or each independently?
6. Do top/bottom surfaces need intrinsic/auto sizing in addition to explicit sizes?
7. Should opening/replacement be synchronous from the caller's perspective or expose an asynchronous lifecycle (`open()` / `close()` promises and before/after events)?
8. Should fullscreen have its own transition presets (fade, scale, slide) or share the edge transition model with a configurable animation strategy?
9. Which integration contract between `nte-offcanvas` and NTE Nav should be guaranteed by tests (focus, nested submenus, sizing, scroll ownership, close events, responsive mode changes)?
