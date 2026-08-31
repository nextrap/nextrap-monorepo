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

`nte-offcanvas` must therefore avoid assumptions about its content that would interfere with NTE Nav's own layout, focus handling, submenu logic, responsive behavior, events, or internal stacking.

The integration contract should favor composition: `nte-offcanvas` owns surface placement, opening/closing, modality, backdrop, page displacement and arbitration; NTE Nav owns navigation structure and navigation-specific interaction.

## Content model and programmatic construction

`nte-offcanvas` must support both declarative HTML content and programmatically supplied content.

Programmatic construction should use a constructor options object. The options object may contain a `content` value. The exact TypeScript type will be finalized during API design, but the architecture requires at least the following content forms:

- a Lit `TemplateResult` / template
- an `HTMLElement`
- a custom element or any suitable element derived from `HTMLElement`

Conceptually:

```ts
const offcanvas = new NteOffcanvas({
  content: html`<new-form></new-form>`
});
```

or:

```ts
const form = new NewForm();
const offcanvas = new NteOffcanvas({ content: form });
```

This allows application code to create reusable forms, navigation components, editors or other custom elements first and then hand the resulting element directly to the offcanvas surface.

The content abstraction should normalize the supported input forms internally so the rest of the offcanvas lifecycle does not care whether the content originated from a template or an element instance.

### Extending offcanvas

The architecture should also allow application-specific classes to extend the offcanvas abstraction and predefine their content/configuration. This provides a programmatic usage pattern comparable to the existing NTE Dialog component approach while retaining the offcanvas-specific lifecycle and grouping behavior.

A derived offcanvas may therefore establish default constructor options/content and still participate in the normal `open()`, `close()`, group, modal and presentation mechanisms.

The implementation must define a clean content render boundary so application-specific content can be encapsulated where appropriate, including Shadow DOM based custom elements. Passing an existing custom element as `content` must preserve that element's own Shadow DOM and lifecycle rather than cloning/recreating its internals.

Declarative slot-based content remains supported and should not require the programmatic constructor API.

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

Placement is treated as stable for an active open/close cycle. Changing placement while an offcanvas is open is not supported.

### Layout strategy

Two primary strategies exist for edge-attached surfaces.

#### Overlay

The surface does not change the available layout space of the page. It enters above existing content.

#### Push

The surface participates in the effective application layout and reduces the space available to a configured content pane.

For left/right surfaces this shifts or constrains the target content horizontally. For top/bottom surfaces this reserves vertical space. A bottom push surface must not permanently cover the end of the document; users must still be able to scroll all page content into view.

Fullscreen does not use `push`; it occupies the full available viewport/application surface.

The component must not directly and unconditionally manipulate `document.body`.

## CSS-driven presentation configuration

Presentation values should be available as CSS custom properties with component-local defaults. Themes may override these values globally or selectively without being required to define them.

Important presentation values include at least:

- effective mode (`overlay` / `push`)
- placement
- width/height and relevant min/max sizing
- transition duration
- transition easing
- backdrop presentation such as color/opacity/blur

Responsive behavior is explicitly outside the responsibility of `nte-offcanvas`. Responsive frameworks such as trunk.js may change classes/styles which in turn change the effective CSS custom properties.

The component evaluates its effective CSS configuration using `getComputedStyle()` initially and re-evaluates it when its own `class` or `style` attribute changes. It does not implement its own breakpoint system.

Because arbitrary CSS-context changes cannot always be observed reliably, structural presentation changes such as placement changes are not supported while the offcanvas is open.

## Interaction mode

Interaction blocking is separate from placement and layout strategy.

An offcanvas can be:

- **non-modal:** the remaining page stays interactive.
- **modal:** interaction outside the surface is blocked.

A modal surface may optionally use a backdrop. The standard backdrop should follow Nextrap's visual language: animated, darkened and blurred. Backdrop appearance must remain themeable.

Modal behavior is expected to include proper focus handling, keyboard dismissal rules where allowed, scroll handling and inaccessible/inert background content.

Fullscreen surfaces will commonly be modal, but fullscreen and modality are not the same concept.

## Multiple offcanvas instances

A page may contain many `nte-offcanvas` elements.

### Open groups

Exclusivity is controlled through an optional named group rather than being hard-coded by edge or placement.

If an offcanvas belongs to an open group, opening it requests all other currently open members of that same group to close. This creates a mutually exclusive set independent of where the individual surfaces are placed.

Examples:

- a `main-navigation` group could contain a left desktop navigation, a right alternative navigation and a fullscreen mobile navigation; only one may be active at a time.
- a `tools` group could contain multiple inspectors that all use the right edge and replace each other.
- a `global-surface` group could contain surfaces at different edges that must never coexist.
- an offcanvas without an open group is not automatically exclusive with another instance merely because both use the same placement.

This group model also enables controlled toggling/cycling between related surfaces.

A single offcanvas should initially belong to at most one exclusivity/open group.

Locking/priorities are intentionally out of scope for the initial architecture.

### Coordination instead of DOM assumptions

Multiple instances should be coordinated through a dedicated offcanvas manager/controller or equivalent shared mechanism. Components should not locate and manipulate arbitrary sibling instances directly through document queries.

The coordination mechanism is responsible for:

- registering offcanvas instances and their open groups
- tracking the active member of each open group
- handling replacement and toggle requests
- serializing close/open transitions where necessary
- avoiding animation races

Placement and open-group membership are independent metadata.

## NTE Offcanvas Pane

Push mode requires cooperation between the offcanvas and the page/application content. This responsibility should be represented by a separate element in the same package, currently named **`nte-offcanvas-pane`**.

The pane is an offcanvas-aware content container. It can be associated with one or more offcanvas layout groups and reacts to active push surfaces by reserving the appropriate space on the corresponding side.

A single pane may therefore react to different surfaces on different sides, for example a left navigation and a right inspector.

The pane should use real layout insets/padding where practical rather than treating push solely as a visual transform, so the available content area remains correct.

Offcanvas and pane must share the effective geometry and animation timing so both move synchronously.

The pane does not own responsive logic. If CSS/class changes cause an associated offcanvas to evaluate to `overlay` instead of `push`, the pane simply stops reserving space for that surface.

The package may additionally provide SCSS mixins for pane/push styling and theme defaults, but the pane element is the runtime coordination primitive.

## Stacking

Open-group exclusivity is different from visual `z-index` stacking.

The architecture should still allow a well-defined global layer order so an offcanvas can coexist predictably with dialogs, toasts, popovers and other application surfaces.

Nested or deliberately stacked offcanvas surfaces are not a primary use case.

## Expected use-case matrix

| Use case | Placement | Typical layout | Typical interaction |
| --- | --- | --- | --- |
| Main navigation | left/right | overlay or push | non-modal or modal |
| Fullscreen main navigation | fullscreen | fullscreen/overlay | usually modal |
| Filters | left/right | overlay | usually modal on small screens |
| Cart | right | overlay | modal or non-modal |
| Inspector/details | left/right | push or overlay | usually non-modal |
| Application sidebar | left/right | push | non-modal |
| Cookie/consent | bottom/top | push or overlay | optionally modal |
| Announcement | top/bottom | push | non-modal |
| Persistent action bar | bottom | push | non-modal |
| Mobile tool sheet | bottom | overlay | often modal |
| Fullscreen search/command surface | fullscreen | fullscreen/overlay | usually modal |
| Programmatic form/editor | any | overlay or push | application-specific |

## Cases that should probably remain separate components

`nte-offcanvas` should not become a universal floating-surface abstraction.

The following are better represented by dedicated primitives unless future requirements demonstrate otherwise:

- ordinary centered dialogs and alert dialogs
- small anchored popovers and menus
- tooltips
- transient toast notifications
- fully draggable/resizable floating windows

Fullscreen is intentionally an exception because it is needed as a first-class presentation for navigation and other large application surfaces and benefits from the same offcanvas coordination model.

## Architecture decisions made

1. Exclusivity is configurable and based on named open groups, not implicitly on edge/placement.
2. Opening one member of an open group closes other open members of that group.
3. Grouping works across placements, including fullscreen.
4. Locking/priorities are not part of the initial scope.
5. Push does not directly manipulate the body; `nte-offcanvas-pane` is the runtime content/layout primitive.
6. A pane can react to one or more associated offcanvas/layout groups and can reserve space on multiple sides.
7. Offcanvas and pane share geometry, duration and easing so transitions remain synchronized.
8. Presentation configuration is CSS-variable driven and may be changed through classes/styles; responsive logic remains external to the component.
9. Effective CSS configuration is evaluated on connect and re-evaluated when the offcanvas element's own `class` or `style` attribute changes.
10. Placement changes while open are not supported.
11. Programmatic construction uses an options object which may contain content.
12. Programmatic content supports Lit templates and existing `HTMLElement`/custom-element instances.
13. Application-specific offcanvas classes may extend the abstraction and predefine content/configuration.
14. Existing element instances supplied as content retain their own lifecycle and Shadow DOM.

## Open architecture questions

1. What should the final public names be for exclusivity and layout coordination (`open-group`, `layout-group`, etc.)?
2. Can modal offcanvas surfaces from different open groups coexist, or should modality optionally introduce a separate global exclusivity rule?
3. How exactly should offcanvas communicate push state and dimensions to `nte-offcanvas-pane`?
4. What is the final constructor options type and content union type?
5. How should declarative slotted content and constructor-supplied content behave if both are provided?
6. Do top/bottom surfaces need intrinsic/auto sizing in addition to explicit sizes?
7. Should opening/replacement expose an asynchronous lifecycle (`open()` / `close()` promises and before/after events)?
8. Should fullscreen have its own transition presets or share the edge transition model?
9. Which integration contract between `nte-offcanvas` and NTE Nav should be guaranteed by tests?
10. Should toggling/cycling through members of an open group be exposed directly by the manager API?
