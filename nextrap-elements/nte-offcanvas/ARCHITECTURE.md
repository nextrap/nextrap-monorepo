# NTE Offcanvas Architecture

## Purpose

`nte-offcanvas` is a generic edge-attached surface component. It is not limited to navigation drawers. Its job is to present content from one viewport edge and coordinate how that surface affects the remaining page.

The component should support four edges (`left`, `right`, `top`, `bottom`) and two fundamental layout strategies (`overlay`, `push`). Modal interaction and backdrops are orthogonal behaviors that can be enabled where appropriate.

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

## Behavioral dimensions

The architecture should treat the following dimensions independently wherever possible.

### Edge

An offcanvas belongs to exactly one viewport edge:

- `left`
- `right`
- `top`
- `bottom`

Animation direction and layout effects derive from that edge.

### Layout strategy

Two primary strategies exist:

#### Overlay

The surface does not change the available layout space of the page. It enters above existing content.

This is suitable for transient navigation, inspectors, carts and modal interactions.

#### Push

The surface participates in the effective page layout and reduces the space available to the main content.

For left/right surfaces this shifts or constrains the body/application content horizontally.

For top/bottom surfaces this reserves vertical space. In particular, a bottom push surface must not permanently cover the end of the document; users must still be able to scroll all page content into view.

### Interaction mode

Interaction blocking is separate from placement and layout strategy.

An offcanvas can be:

- **non-modal:** the remaining page stays interactive.
- **modal:** interaction outside the surface is blocked.

A modal surface may optionally use a backdrop. The standard backdrop should follow Nextrap's visual language: animated, darkened and blurred. Backdrop appearance must remain themeable.

Modal behavior is expected to include proper focus handling, keyboard dismissal rules where allowed, scroll handling and inaccessible/inert background content.

### Backdrop

Backdrop behavior must not define whether the offcanvas is overlay or push. For example, a push layout can still temporarily lock interaction if required.

The backdrop should therefore be modeled as an interaction/presentation option rather than as a layout mode.

## Multiple offcanvas instances

A page may contain many `nte-offcanvas` elements.

### Edge ownership

By default, only one offcanvas may be open for a given edge at a time.

Opening another element assigned to the same edge should request the currently open element to close before the new one becomes active.

Different edges are independent. For example, a left surface and a bottom surface may coexist unless another policy explicitly prevents it.

### Priority / lock

An active offcanvas can acquire a lock for its edge. While locked, another offcanvas targeting that edge cannot replace it.

This is intended for surfaces that must remain authoritative until an explicit condition is fulfilled, for example:

- mandatory consent flows
- critical confirmation or transactional steps
- unsaved editor/tool state
- application states where replacement would be destructive or confusing

The coordination layer must distinguish between normal close requests and forced/internal teardown. A lock must not make lifecycle cleanup impossible.

### Coordination instead of DOM assumptions

Multiple instances should be coordinated through a dedicated offcanvas manager/controller or equivalent shared mechanism. Components should not locate and manipulate arbitrary sibling instances directly through document queries.

The coordination mechanism is responsible for:

- tracking the active surface for each edge
- handling replacement requests
- respecting locks/priorities
- serializing close/open transitions where necessary
- avoiding animation races

Whether this manager lives in the framework layer or inside the package remains an implementation decision.

## Stacking

"One open element per edge" is the default arbitration rule and is different from visual `z-index` stacking.

The architecture should still allow a well-defined global layer order so an offcanvas can coexist predictably with dialogs, toasts, popovers and other application surfaces.

Nested or deliberately stacked offcanvas surfaces are not a primary use case. They should only be introduced later if a concrete requirement cannot be represented by independent edges or another surface type.

## Expected use-case matrix

| Use case | Edge | Typical layout | Typical interaction |
| --- | --- | --- | --- |
| Main navigation | left/right | overlay or push | non-modal or modal |
| Filters | left/right | overlay | usually modal on small screens |
| Cart | right | overlay | modal or non-modal |
| Inspector/details | left/right | push or overlay | usually non-modal |
| Application sidebar | left/right | push | non-modal |
| Cookie/consent | bottom/top | push or overlay | optionally modal/locked |
| Announcement | top/bottom | push | non-modal |
| Persistent action bar | bottom | push | non-modal |
| Mobile tool sheet | bottom | overlay | often modal |
| Critical workflow surface | any edge | overlay or push | modal and optionally locked |

## Additional application areas to keep in scope

The same architecture naturally covers several cases beyond navigation and cookie banners:

- **responsive desktop/mobile sidebars:** a push sidebar on desktop can use the same conceptual surface as an overlay drawer on mobile.
- **master-detail / inspector UI:** selecting an item opens a persistent detail pane without navigating away.
- **filter and search panels:** especially useful when switching between push and modal overlay behavior at breakpoints.
- **shopping carts and checkout summaries:** transient right-side surfaces with optional interaction blocking.
- **command/help/settings surfaces:** contextual application tools that should not require a full dialog.
- **persistent status/action regions:** upload progress, media controls, bulk-selection actions or workflow controls attached to top/bottom.
- **system notices requiring acknowledgement:** an edge surface can be locked and modal without necessarily behaving like a centered dialog.

## Cases that should probably remain separate components

`nte-offcanvas` should not become a universal floating-surface abstraction.

The following are better represented by dedicated primitives unless future requirements demonstrate otherwise:

- centered dialogs and alert dialogs
- small anchored popovers and menus
- tooltips
- transient toast notifications
- fully draggable/resizable floating windows

The defining characteristic of `nte-offcanvas` should remain: **a substantial surface attached to one viewport/application edge whose opening may overlay or alter the available page space.**

## Open architecture questions

The following questions should be decided before finalizing the public API:

1. Is arbitration strictly per edge, or do we additionally need named channels/groups independent of edge?
2. Can multiple different edges be modal simultaneously, or should modal mode introduce a global exclusivity rule?
3. Should `push` modify the document/body directly or require an explicit layout/container target?
4. Should responsive mode changes (for example push on desktop, overlay on mobile) be built into `nte-offcanvas` or handled externally through CSS/application state?
5. What exactly does a lock prevent: competing opens only, dismissal by backdrop/Escape, programmatic close, or each independently?
6. Do top/bottom surfaces need intrinsic/auto sizing in addition to explicit sizes?
7. Should opening/replacement be synchronous from the caller's perspective or expose an asynchronous lifecycle (`open()` / `close()` promises and before/after events)?
