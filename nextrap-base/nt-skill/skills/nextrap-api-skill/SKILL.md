---
name: nextrap-api-skill
description: Use this skill to choose Nextrap packages, understand their public role, and route to the package-local usage or theming contract before writing application code.
---

# Nextrap API Skill

This is the repository-wide routing and orientation skill for `nextrap/nextrap-monorepo`. It is intentionally code-free. It does not replace package-local usage/theming skills; when a package has a local skill, read that file before using the package API.

## Repository rules

- Cross-package imports use `@nextrap/<package>`.
- Prefer package-local `skills/*-usage/SKILL.md` for markup/API questions and `skills/*-theming/SKILL.md` for theme work.
- Do not infer API from generated `dist`, `node_modules`, or demos when a package-local skill or source entrypoint exists.
- Nextrap elements are Lit Web Components; visual defaults belong in theme/package Sass rather than hard-coded application CSS.
- `@trunkjs/content-pane` and `@trunkjs/responsive` are integration foundations for layout/content use cases.

## Package map

### Base packages

| Package | Purpose | Public API / use case |
|---|---|---|
| `@nextrap/nt-core` | Common Nextrap element foundation and mixins. | `nextrap_element()` and core mixin/runtime contracts used by Nextrap components. Use when implementing a Nextrap component, not as a visual component itself. |
| `@nextrap/nt-framework` | Framework/integration foundations. | Shared integration helpers; verify the package entrypoint before direct use. |
| `@nextrap/nt-meta` | Package/meta helpers. | Internal/package metadata utilities; treat as infrastructure and inspect its public entrypoint before use. |
| `@nextrap/nt-nx-generators` | Nx generators and package templates. | Generator entrypoints for creating/migrating Nextrap packages. |
| `@nextrap/nt-scope` | Scope/runtime helpers. | Scope-related helpers used across packages; prefer its public entrypoint. |
| `@nextrap/nt-skill` | Code-free repository API documentation. | This package; its primary artifact is `skills/nextrap-api-skill/SKILL.md`. |

### Element packages

For ordinary element packages the custom element name follows the package name (`@nextrap/nte-x` → `<nte-x>`), unless a package-local usage skill says otherwise.

| Package | Purpose / important surface |
|---|---|
| `@nextrap/nte-accordion` | Accordion/disclosure UI. Public surface includes `NteAccordionElement`, `<nte-accordion>`, `NteAccordionItemElement`, and `<nte-accordion-item>`. |
| `@nextrap/nte-burger` | Accessible responsive navigation disclosure. Public surface includes `<nte-burger>`, `NteBurger`, state attributes and `toggle()`. |
| `@nextrap/nte-card` | Card content/presentation component; use package-local usage/theming contracts for slots and variants. |
| `@nextrap/nte-consent-blocker` | Blocks consent-gated embeds/content until permission is available. |
| `@nextrap/nte-data-table` | Object-array data table built around a serializable table definition/view state. Use for data-driven tables rather than raw table layout. |
| `@nextrap/nte-demo-viewer` | Nextrap demo presentation/integration component. Prefer `@trunkjs/demo-viewer` for demo-definition contracts. |
| `@nextrap/nte-dialog` | Dialog/modal element and dialog interaction API. |
| `@nextrap/nte-dialog-component` | Component foundation for content shown in dialogs. |
| `@nextrap/nte-element-highlighter` | Visual/interaction helper for highlighting DOM elements. |
| `@nextrap/nte-feedback` | Central application feedback channel. Public surface includes the static `Feedback` API for alerts, confirmations, loading/progress and success/error feedback. |
| `@nextrap/nte-image` | Image element for Nextrap content patterns. |
| `@nextrap/nte-infiniscroll` | Infinite-scroll behavior/component. |
| `@nextrap/nte-input` | Current input/form element; prefer this package over the legacy input unless compatibility requires otherwise. |
| `@nextrap/nte-input-old` | Legacy input element. Avoid for new work unless migration/compatibility requires it. |
| `@nextrap/nte-multiselect` | Multi-selection form control. |
| `@nextrap/nte-nav` | Site navigation and nested submenu composition. Package-local usage guidance covers responsive relocation patterns. |
| `@nextrap/nte-navbar` | Multi-line site header/navigation regions, including static/sticky/fixed placement and responsive composition. |
| `@nextrap/nte-offcanvas` | Offcanvas/drawer content, commonly paired with navigation/burger controls. |
| `@nextrap/nte-parallax-bg` | Parallax background presentation. |
| `@nextrap/nte-privacy-consent` | Declarative privacy-gated scripts/embeds and consent dialog configuration. |
| `@nextrap/nte-progress` | Determinate/stepped/circular progress. Public surface includes `<nte-progress>` and progress/step/completed events. |
| `@nextrap/nte-scroll-to-top` | Scroll-to-top control. Public surface includes `NteScrollToTop` and `<nte-scroll-to-top>`. |
| `@nextrap/nte-scrollspy` | Active-section/scrollspy behavior. |
| `@nextrap/nte-slider` | Slider/carousel presentation. |
| `@nextrap/nte-spinner` | Loading spinner. Public surface includes `NteSpinnerElement` and `<nte-spinner>`. |
| `@nextrap/nte-split-view` | Split-view component. |
| `@nextrap/nte-stepper` | Stepper/wizard UI. |
| `@nextrap/nte-table` | Native Light-DOM table foundation with scrollable body, column states and programmatic selection. Use for table infrastructure; use `nte-data-table` for object-array rendering. |
| `@nextrap/nte-theme-switcher` | Theme switching control. |
| `@nextrap/nte-tree-node` | Tree/node hierarchy UI. |

### Layout packages

Layout packages are intended for Markdown/Kramdown content routed through `@trunkjs/content-pane`; read the package-local usage skill before writing layout markup.

| Package | Purpose |
|---|---|
| `@nextrap/ntl-2col` | Two-column layout and reference layout implementation. |
| `@nextrap/ntl-card-grid` | Card grid layout. |
| `@nextrap/ntl-card-row` | Card row layout/reference component. |
| `@nextrap/ntl-footer` | Footer layout. |
| `@nextrap/ntl-form` | Form-oriented layout. |
| `@nextrap/ntl-hero` | Hero/header layout. |

### Style packages

| Package | Purpose / contract |
|---|---|
| `@nextrap/style-base` | Token-only `--nt-*` design-token/theme generation layer; importing the Sass API must remain visually side-effect free. |
| `@nextrap/style-utils` | Atomic utility mixins/classes. |
| `@nextrap/style-elements` | Reusable visual element patterns such as prose/table/container. |
| `@nextrap/style-typography` | Typographic rules and vertical rhythm, not page/section layout. |
| `@nextrap/style-button` | Button styling/mixins. |
| `@nextrap/style-reset` | Shadow-DOM-safe reset. |
| `@nextrap/style-switch` | Accessible switch styles. |

## Decision guide

- Need reusable UI? Start with the matching `nte-*` usage skill.
- Need page/content structure? Start with the matching `ntl-*` usage skill and Content Pane markup.
- Need application feedback? Use `@nextrap/nte-feedback`.
- Need raw/native table behavior? Use `@nextrap/nte-table`; for data objects and view-state use `@nextrap/nte-data-table`.
- Need responsive behavior? Prefer the existing `@trunkjs/responsive` integration rather than adding component-local resize logic.
- Need styling? Read the target package theming skill and compose existing Sass mixins/parts/tokens before adding new styling surface.

## Baseline provenance

Baseline established 2026-09-03 from the repository package directories, `AGENTS.md`, `AGENT_CONTEXT.md`, package entrypoints and existing package-local skills. This skill should be updated when public package APIs, package inventory, usage skills, architecture contracts, or relevant tests/docs change.
