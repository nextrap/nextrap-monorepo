# NTE Offcanvas Architecture

## Purpose

`nte-offcanvas` is a generic edge-attached or fullscreen surface component. It is not limited to navigation drawers. Its job is to present substantial application content from a viewport edge or across the full viewport and coordinate how that surface affects the remaining page.

The component should support four edges (`left`, `right`, `top`, `bottom`), a dedicated `fullscreen` presentation mode, and two fundamental layout strategies (`overlay`, `push`) for edge-attached variants. Modal interaction, backdrop behavior, grouping and layout displacement are orthogonal behaviors that can be combined where appropriate.

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

Fullscreen should normally occupy the complete available viewport/application surface. Unlike edge-attached variants, `push` is not meaningful for fullscreen; fullscreen is inherently a replacing/overlaying presentation.

Whether fullscreen excludes other offcanvas instances is not hard-coded by placement. It is controlled through the same grouping/arbitration mechanism as other offcanvas instances.

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

Placement itself does not define exclusivity. Two offcanvas instances at the same or at different placements may coexist unless they share an exclusivity group or another explicit policy prevents it.

### Layout strategy

Two primary strategies exist for edge-attached surfaces.

#### Overlay

The surface does not change the available layout space of the page. It enters above existing content.

This is suitable for transient navigation, inspectors, carts and modal interactions.

#### Push

The surface participates in the effective application layout and reduces the space available to a configured content/layout container.

For left/right surfaces this shifts or constrains the target content horizontally.

For top/bottom surfaces this reserves vertical space. In particular, a bottom push surface must not permanently cover the end of the document; users must still be able to scroll all page content into view.

Fullscreen does not use `push`; it occupies the full available viewport/application surface.

The component should not directly and unconditionally manipulate `document.body`. Push behavior must instead be expressed through an explicit layout contract so it can work with the document body, an application shell, an embedded layout or another chosen container.

### Interaction mode

Interaction blocking is separate from placement and layout strategy.

An offcanvas can be:

- **non-modal:** the remaining page stays interactive.
- **modal:** interaction outside the surface is blocked.

A modal surface may optionally use a backdrop. The standard backdrop should follow Nextrap's visual language: animated, darkened and blurred. Backdrop appearance must remain themeable.

Modal behavior is expected to include proper focus handling, keyboard dismissal rules where allowed, scroll handling and inaccessible/inert background content.

Fullscreen surfaces will commonly be modal, but the architecture must not hard-code fullscreen and modality as the same concept.

### Backdrop

Backdrop behavior must not define whether the offcanvas is overlay or push. For example, a push layout can still temporarily lock interaction if required.

The backdrop should therefore be modeled as an interaction/presentation option rather than as a layout mode.

## Multiple offcanvas instances

A page may contain many `nte-offcanvas` elements.

### Open groups

Exclusivity is controlled through an optional named group rather than being hard-coded by edge or placement.

The working concept is an **open group** (final public naming still to be decided, e.g. `open-group`).

If an offcanvas belongs to an open group, opening it requests all other currently open and replaceable members of that same group to close. This creates a mutually exclusive set independent of where the individual surfaces are placed.

Examples:

- a `main-navigation` group could contain a left desktop navigation, a right alternative navigation and a fullscreen mobile navigation; only one may be active at a time.
- a `tools` group could contain multiple inspectors that all use the right edge and replace each other.
- a `global-surface` group could contain surfaces at different edges that must never coexist.
- an offcanvas without an open group is not automatically exclusive with another instance merely because both use the same placement.

This group model also enables controlled toggling/cycling between related surfaces. Opening the next member naturally closes the previously active member without requiring direct coupling between those components.

A single offcanvas should initially belong to at most one exclusivity/open group. Multiple simultaneous group memberships would make arbitration and locks significantly harder to reason about and should only be introduced if a concrete requirement appears.

### Priority / lock

An active offcanvas can acquire a lock for its open group/arbitration scope. While locked, a competing offcanvas in the same exclusivity scope cannot replace it.

This is intended for surfaces that must remain authoritative until an explicit condition is fulfilled, for example:

- mandatory consent flows
- critical confirmation or transactional steps
- unsaved editor/tool state
- application states where replacement would be destructive or confusing
- a primary fullscreen navigation/workflow that must not be interrupted by another grouped offcanvas request

The coordination layer must distinguish between normal close requests and forced/internal teardown. A lock must not make lifecycle cleanup impossible.

The exact lock semantics remain to be specified separately: replacement, Escape dismissal, backdrop dismissal and programmatic close do not necessarily need to share the same lock rule.

### Coordination instead of DOM assumptions

Multiple instances should be coordinated through a dedicated offcanvas manager/controller or equivalent shared mechanism. Components should not locate and manipulate arbitrary sibling instances directly through document queries.

The coordination mechanism is responsible for:

- registering offcanvas instances and their open groups
- tracking the active member of each open group
- handling replacement and toggle requests
- respecting locks/priorities
- serializing close/open transitions where necessary
- avoiding animation races

Placement and open-group membership are independent metadata. The manager must not infer exclusivity solely from `left`, `right`, `top`, `bottom` or `fullscreen`.

Whether this manager lives in the framework layer or inside the package remains an implementation decision.

## Push layout contract

Push mode requires cooperation between the offcanvas and the page/application layout. This should be implemented as an explicit styling/layout contract rather than by directly rewriting body styles from the component.

### Layout target

The application must be able to define which element is displaced when a push offcanvas opens. This may be:

- the document/body-level application content
- an application shell
- a page wrapper
- a nested workspace/layout container

The final API may expose this through a target/group identifier, shared state attributes, CSS custom properties, or another framework-supported mechanism. The important architectural rule is that push behavior targets an explicit layout context.

### SCSS mixin

The package should provide an SCSS mixin that can be included on the body or another layout container to opt that container into offcanvas push behavior.

Conceptually:

```scss
.app-layout {
  @include offcanvas.push-layout(...);
}
```

The exact mixin name and parameters remain to be defined.

The mixin should provide the CSS necessary to react to the active push offcanvas and move/reduce the target content in the corresponding direction.

### Shared geometry and timing

The offcanvas surface and its push target must use the same source of truth for geometry and animation timing.

At minimum, the layout contract should expose shared values equivalent to:

- active placement/direction
- effective offcanvas width or height
- transition duration
- transition easing
- open/closed state

This avoids duplicated magic values such as a panel animating for `200ms` while the page moves for `400ms`.

The preferred implementation should rely on CSS custom properties/state selectors where possible so the panel and pushed content animate in the same rendering cycle.

For a left push surface, for example, opening the offcanvas and shifting the layout target to the right should be two visual consequences of the same state transition rather than separate JavaScript animations.

### Multiple push surfaces

The layout model must not assume that `body` can only ever be affected by one hard-coded offcanvas. Layout groups/targets should make it possible to define which surfaces affect which layout context.

If multiple simultaneously open push surfaces are allowed for the same layout target, the behavior must be deterministic. The initial implementation should prefer mutually exclusive open groups for conflicting push surfaces rather than attempt arbitrary additive transforms until a real requirement for combined pushes exists.

## Stacking

Open-group exclusivity is different from visual `z-index` stacking.

The architecture should still allow a well-defined global layer order so an offcanvas can coexist predictably with dialogs, toasts, popovers and other application surfaces.

Fullscreen belongs to the same offcanvas coordination model but visually occupies a viewport-covering surface role.

Nested or deliberately stacked offcanvas surfaces are not a primary use case. They should only be introduced later if a concrete requirement cannot be represented by independent groups, placements, fullscreen, or another surface type.

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

- **responsive desktop/mobile sidebars:** a push sidebar on desktop can use the same conceptual surface as an overlay drawer or fullscreen navigation on mobile, with all variants sharing one `main-navigation` open group.
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

The defining characteristic of `nte-offcanvas` should therefore remain: **a substantial application surface attached to a viewport/application edge or occupying it entirely, whose opening may overlay, replace, or alter the available page space and whose lifecycle is coordinated with related offcanvas surfaces through explicit groups.**

## Architecture decisions made

The following decisions are currently established:

1. Exclusivity is configurable and based on named open groups, not implicitly on edge/placement.
2. Opening one member of an open group closes other replaceable open members of that group.
3. Grouping must work across placements, including fullscreen, enabling responsive navigation variants to share one group.
4. Push mode should not directly depend on arbitrary `body.style` manipulation.
5. Push behavior uses an explicit layout target/context and should be supported by a package SCSS mixin.
6. Offcanvas and push target must share geometry, duration and easing so their transitions stay synchronized.

## Open architecture questions

The following questions should be decided before finalizing the public API:

1. What should the final public names be for exclusivity and layout coordination (`open-group`, `layout-group`, `push-target`, etc.)?
2. Can modal offcanvas surfaces from different open groups coexist, or should modality optionally introduce a separate global exclusivity rule?
3. How should the offcanvas communicate push state and dimensions to its layout target: attributes/classes on a shared root, CSS custom properties, framework events/controller state, or a combination?
4. Should responsive mode changes (for example push on desktop, overlay or fullscreen on mobile) be built into `nte-offcanvas` or handled externally through CSS/application state?
5. What exactly does a lock prevent: competing opens only, dismissal by backdrop/Escape, programmatic close, or each independently?
6. Do top/bottom surfaces need intrinsic/auto sizing in addition to explicit sizes?
7. Should opening/replacement be synchronous from the caller's perspective or expose an asynchronous lifecycle (`open()` / `close()` promises and before/after events)?
8. Should fullscreen have its own transition presets (fade, scale, slide) or share the edge transition model with a configurable animation strategy?
9. Which integration contract between `nte-offcanvas` and NTE Nav should be guaranteed by tests (focus, nested submenus, sizing, scroll ownership, close events, responsive mode changes)?
10. Should toggling/cycling through members of an open group be exposed directly by the manager API or remain an application-level operation built from `open()` calls?
