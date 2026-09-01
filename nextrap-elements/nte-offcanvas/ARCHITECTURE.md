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

## Content model and slots

`nte-offcanvas` must support both declarative HTML content and programmatically supplied content.

The declarative content model consists of three primary content regions plus an optional close-control region:

- `slot="header"` for titles, toolbars, navigation headers and related controls
- the default slot for the main content
- `slot="footer"` for actions, status areas or persistent controls
- `slot="close"` for an application-supplied close control that replaces the built-in default close control

The corresponding internal styling parts should expose at least `header`, `main`, `footer` and `close` so themes can style these regions independently.

Header and footer regions should collapse completely when no content is present.

The component must not require applications to create a header only to obtain a close button. The close control has its own region and can be positioned together with the header when one exists or use a defined standalone position when no header exists.

### Default close control

`nte-offcanvas` should provide a built-in default close button. Its purpose is to keep close affordances consistent and remove repetitive markup from common offcanvas use cases.

If the `close` slot is populated, the supplied content replaces the built-in close control.

Visibility of the close control must be presentation-driven and configurable through CSS custom properties rather than requiring a dedicated HTML visibility attribute. This allows themes, style classes and responsive class systems to determine whether the close affordance is shown.

The built-in close button must remain accessible and provide an appropriate accessible name independently of the visual icon.

For the first implementation, the close icon and close-button styling may live directly in the `nte-offcanvas` component styles.

### Future shared close-button styling

A future style-system cleanup should move the generic close icon into Style Base as a global icon token so all Nextrap components can use the same close glyph.

The same future cleanup should introduce a reusable generic close-button style or Sass mixin in the appropriate shared styling package (for example Style Utils or Style Elements). Dialog, Offcanvas and other components should then consume that shared primitive instead of maintaining independent close-button visuals.

The long-term goal is one themeable close icon and one consistent close-button interaction style across components, including hit area, hover/focus treatment and disabled/interaction states.

## Programmatic construction

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

Placement alone does not define exclusivity. Two modal offcanvas surfaces with the same effective placement are mutually exclusive: when a second one opens, it waits until the first one has completed closing before it opens. Non-modal surfaces do not become exclusive merely because they share a placement. Named open groups continue to provide exclusivity across placements and interaction modes.

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
- close-control visibility and related close-control presentation values
- motion/animation values used by the default placement transitions

Responsive behavior is explicitly outside the responsibility of `nte-offcanvas`. Responsive frameworks such as trunk.js may change classes/styles which in turn change the effective CSS custom properties.

The component evaluates its effective CSS configuration using `getComputedStyle()` initially and re-evaluates it when its own `class` or `style` attribute changes. It does not implement its own breakpoint system.

Because arbitrary CSS-context changes cannot always be observed reliably, structural presentation changes such as placement changes are not supported while the offcanvas is open.

## Motion and animation

Motion is part of the default component presentation but must remain themeable. Themes/classes may replace the default transition timing, easing and motion characteristics through CSS.

The component should prefer CSS-driven animation so presentation can be overridden without changing component logic. JavaScript owns lifecycle/state; CSS owns the visual interpolation.

### Left and right placement

The default left/right motion should not be a plain linear slide to the final position. It should use a small overshoot / settling effect so the surface appears to snap into place.

Conceptually, opening uses three states:

1. the surface begins outside the viewport on its placement side
2. it moves slightly beyond the final resting position (approximately a five-percent overshoot)
3. it settles back to the final `100%` / resting position

Closing mirrors that motion: the surface first moves slightly into the overshoot/settling direction and then leaves the viewport completely toward its placement side.

The exact percentage, timing distribution and easing are styling concerns and should be represented by component CSS/custom properties rather than hard-coded JavaScript delays.

The default should feel responsive and slightly elastic without behaving like a pronounced spring animation.

### Fullscreen placement

Fullscreen should initially use a simple top-to-bottom drop/slide presentation rather than a 3D flip.

A 3D flip may be implemented later as an optional theme/style variant, but should not be the baseline motion because it is more visually dominant and less neutral for general application/navigation content.

The default fullscreen surface therefore enters from above and settles into the full viewport, and exits back toward the top.

### Top and bottom placement

Top and bottom placements should use a sliding-window / sheet presentation. The surface moves into the viewport from its corresponding edge and returns toward that edge when closed.

For bottom placement this is intended to support mobile-sheet patterns such as carts, navigation, action panels and similar surfaces.

The visual design may include a handle/bar near the exposed edge of the sheet so it communicates that the surface can conceptually be moved or dismissed.

### Future drag and swipe interaction

Direct gesture interaction is intentionally deferred from the first implementation.

A future extension may allow top/bottom sheets to be dragged with pointer/touch input, including:

- dragging a bottom sheet downward to close it
- dragging a sheet toward a larger/open state where multiple snap positions are later required
- velocity/threshold based completion or cancellation of a drag
- a dedicated drag-handle region

The initial animation/style architecture should avoid making such a future implementation unnecessarily difficult, but no drag physics, snap-point API or gesture state is required now.

### Reduced motion

The default styles should respect `prefers-reduced-motion`. Reduced-motion behavior should be implemented in CSS so themes can preserve or refine that accessibility behavior.

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
- an offcanvas without an open group is not automatically exclusive with another instance merely because both use the same placement, unless both surfaces are modal.

This group model also enables controlled toggling/cycling between related surfaces.

A single offcanvas should initially belong to at most one exclusivity/open group.

Locking/priorities are intentionally out of scope for the initial architecture.

## Window event coordination protocol

Communication between offcanvas instances and offcanvas-aware consumers must use events dispatched on `window`.

This is the public interoperability contract. It must be possible for compatible surfaces, panes and controls implemented in other packages to participate in the same coordination model without importing a shared singleton manager or relying on package-local registries.

The protocol should use namespaced `CustomEvent`s with typed `detail` payloads. The final event names are part of the API design, but the protocol must cover at least:

- opening intent / request
- opened notification
- closing intent / request
- closed notification
- open-group identity
- layout-group identity where applicable
- effective placement
- effective mode (`overlay` / `push`)
- effective size/geometry relevant to push layout
- transition duration
- transition easing
- a stable instance identifier or equivalent source identity

An offcanvas opening in an `open-group` broadcasts that intent/state on `window`. Other compatible instances in the same group can react and close themselves. This keeps exclusivity decentralized and interoperable across package boundaries.

`nte-offcanvas-pane` also consumes the window protocol for push state. It must not require direct references to `nte-offcanvas` instances in order to determine which associated groups currently reserve space on `left`, `right`, `top` or `bottom`.

External packages may implement their own compatible offcanvas-like surfaces as long as they follow the same event contract. Likewise, external consumers may observe the protocol without depending on the `nte-offcanvas` implementation package.

A manager/controller may still exist as an optional convenience abstraction for local state queries, helper methods or event serialization. If present, it must be implemented on top of the same public window-event protocol and must not become a second, incompatible source of truth.

Components must not coordinate by querying arbitrary sibling DOM elements or by requiring that all participating elements originate from the same package version or module instance.

The exact event naming, payload interfaces and whether intent events are cancelable remain API-design decisions.

## NTE Offcanvas Pane

Push mode requires cooperation between the offcanvas and the page/application content. This responsibility should be represented by a separate element in the same package, currently named **`nte-offcanvas-pane`**.

The pane is an offcanvas-aware content container. It can be associated with one or more offcanvas layout groups and reacts to active push surfaces by reserving the appropriate space on the corresponding side.

A single pane may therefore react to different surfaces on different sides, for example a left navigation and a right inspector.

The pane should use real layout insets/padding where practical rather than treating push solely as a visual transform, so the available content area remains correct.

Offcanvas and pane must share the effective geometry and animation timing so both move synchronously. These effective values are communicated through the public window-event protocol.

The pane does not own responsive logic. If CSS/class changes cause an associated offcanvas to evaluate to `overlay` instead of `push`, the resulting state update is broadcast and the pane stops reserving space for that surface.

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

1. Named open groups provide configurable exclusivity across placements and interaction modes. In addition, two modal surfaces with the same effective placement are mutually exclusive, and the second waits for the first to complete closing before it opens.
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
15. Cross-instance and cross-package coordination uses a public namespaced `window` `CustomEvent` protocol.
16. `nte-offcanvas-pane` consumes the same event protocol rather than requiring direct instance references.
17. Any optional manager/controller is a convenience layer on top of the event protocol, not the source of truth.
18. Declarative content uses `header`, default and `footer` content regions plus an optional `close` slot.
19. `nte-offcanvas` provides a built-in accessible default close button; supplying the `close` slot replaces it.
20. Close-control visibility is controlled through CSS custom properties rather than a dedicated visibility attribute.
21. The initial close icon/style may be component-local; future work should move the icon to Style Base and the reusable close-button style/mixin to the shared style utilities/elements package.
22. Default left/right motion uses a subtle overshoot and settle effect rather than a plain slide.
23. Default fullscreen motion is a drop/slide from the top; a 3D flip is reserved as an optional future style variant.
24. Top/bottom placements use a sheet/sliding-window motion baseline.
25. Drag/swipe sheet interaction is deferred to a later extension.
26. Default motion is CSS/theme overrideable and respects `prefers-reduced-motion`.

## Open architecture questions

1. What should the final public names be for exclusivity and layout coordination (`open-group`, `layout-group`, etc.)?
2. What are the exact event names and typed payload interfaces for the public window protocol?
3. Should opening/closing intent events be cancelable?
4. What is the final constructor options type and content union type?
5. How should declarative slotted content and constructor-supplied content behave if both are provided?
6. What are the exact CSS custom-property names and value semantics for close-control visibility and placement?
7. Do top/bottom surfaces need intrinsic/auto sizing in addition to explicit sizes?
8. Should opening/replacement expose an asynchronous lifecycle (`open()` / `close()` promises and before/after events)?
9. Should motion presets be represented only through CSS custom properties/classes or also expose named component-level style variants?
10. Which integration contract between `nte-offcanvas` and NTE Nav should be guaranteed by tests?
11. Should toggling/cycling through members of an open group be exposed directly by a convenience API or remain an application-level operation built from events / `open()` calls?
12. If drag/swipe is added later, should top/bottom sheets support only close gestures or also multiple snap positions?
