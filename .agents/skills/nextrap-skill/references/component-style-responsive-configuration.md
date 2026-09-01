# Component Style & Responsive Configuration

## Goal

Keep presentation, layout and responsive configuration themeable without duplicating it as HTML or JavaScript API. Components consume the effective style produced by Nextrap themes and the TrunkJS Responsive Framework.

The intended flow is:

`TrunkJS Responsive -> classes/styles -> CSS custom properties -> computed component style -> component logic`

## Attribute/property vs. CSS configuration

Use HTML attributes and component properties for semantic, functional and application state, for example `disabled`, `open`, `aria-*`, IDs, target references and domain values.

Prefer public CSS custom properties for presentation, layout, positioning, animation and responsive presentation. Typical examples are sticky/fixed placement, scroll thresholds, sizes, spacing, overlay behavior and collapse/shrink values.

Do not expose the same presentation value as both an HTML/property API and a CSS custom property. Avoid parallel sources of truth.

## Reading style configuration in JavaScript

When JavaScript needs a presentation value for behavior or calculations, read the effective value from the component's computed style using the project-standard component-style helper where available, otherwise `getComputedStyle(...)`.

Do not mirror the same setting into an independent JavaScript configuration object merely for convenience. The computed style is the effective source of truth.

Parse and validate CSS values defensively and provide a safe component default for missing or invalid values.

## Runtime style changes

If JavaScript behavior depends on computed CSS configuration, the component must observe changes to its own `class` and `style` attributes. After either changes, re-read the effective component-style configuration and update all dependent internal calculations/state.

This allows theme classes and responsive classes/styles to alter component behavior without recreating the element.

Changes to inherited CSS custom properties on an ancestor do not necessarily mutate `class` or `style` on the component host. If a component must react immediately to such inherited changes, use the project-standard theme/style refresh mechanism or expose an explicit style refresh entry point. Do not pretend that a host-only MutationObserver can detect arbitrary ancestor style changes.

## Responsive behavior

Do not implement component-local CSS media queries or `matchMedia`/parallel breakpoint listeners for behavior that can be expressed through the TrunkJS Responsive Framework.

The TrunkJS Responsive Framework owns the decision of *when* a breakpoint-dependent change applies. It sets the corresponding classes and/or styles. Those rules change the component's CSS custom properties or other effective styles, and the component consumes the resulting computed style.

Components therefore do not independently interpret project breakpoints. They react to the effective classes/styles supplied by the responsive layer.

For DOM relocation, orientation changes, visibility, presentation values and similar responsive composition, prefer the appropriate TrunkJS responsive classes and components (for example Element Relocator) rather than creating a second responsive implementation inside the component.

## Review checklist

- Is this value semantic/functional state? Use an attribute/property when appropriate.
- Is this value presentation/layout/responsive configuration? Prefer a CSS custom property.
- Does JavaScript need the value? Read the effective computed component style.
- Can the value change through responsive/theme classes? Observe host `class` and `style` and refresh dependent calculations.
- Can it change only through inherited ancestor variables? Use the project style/theme refresh contract when immediate synchronization is required.
- Is breakpoint logic involved? Let TrunkJS Responsive own breakpoint evaluation; do not add component media queries or `matchMedia`.
- Is the same presentation value exposed twice? Remove the duplicate API.