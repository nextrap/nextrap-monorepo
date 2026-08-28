# AGENT_CONTEXT.md – nextrap-monorepo

Created automatically by a coding agent as an onboarding context cache. Keep this file concise and factual; update it when stable repository facts change.

Last verified: 2026-08-28

## Repository

| Fact | Value |
|---|---|
| Root | `/opt` |
| Project | `nextrap-monorepo` / root package `@nextrap/source` |
| Package manager | npm with workspaces and `package-lock.json` |
| Build system | Nx |
| Root package | private |

## Required startup context

- Read root `AGENTS.md` for repository-local rules.
- Use skills first, especially:
  - `project-context-cache`
  - `basic-coding`
  - `nextrap-lib-programming`
  - `ai-usage-info` when editing `.ai-usage-info.md`
  - `nx-monorepo-setup` for Nx/workspace/package structure changes
- For package-specific work, prefer local package skills under:
  - `<package>/skills/<package>-usage/SKILL.md`
  - `<package>/skills/<package>-theming/SKILL.md`

## Workspace layout

| Path | Prefix | Purpose |
|---|---|---|
| `nextrap-base/` | `nt-*` | Shared utilities, styling foundations, generators |
| `nextrap-elements/` | `nte-*` | Lit web components |
| `nextrap-layout/` | `ntl-*` | Layout web components |
| `nextrap-styles/` | `style-*` | Theme/style packages |

Root `package.json` workspaces:

```json
[
  "nextrap-base/*",
  "nextrap-elements/*",
  "nextrap-layout/*",
  "nextrap-styles/*"
]
```

Do not treat ignored/local `workspaces/` content as part of the committed Nx workspace.

## Project list

| Project | Path | Kurzbeschreibung |
|---|---|---|
| `@nextrap/nt-core` | `nextrap-base/nt-core` | Core-Basis für Nextrap-Packages und Web Components |
| `@nextrap/nt-framework` | `nextrap-base/nt-framework` | Framework-/Integrationsgrundlagen |
| `@nextrap/nt-meta` | `nextrap-base/nt-meta` | Meta-/Package-Hilfen |
| `@nextrap/nt-nx-generators` | `nextrap-base/nt-nx-generators` | Nx-Generatoren und Package-Templates |
| `@nextrap/nt-scope` | `nextrap-base/nt-scope` | Scoping-/Hilfsfunktionen |
| `@nextrap/nte-accordion` | `nextrap-elements/nte-accordion` | Accordion-Element |
| `@nextrap/nte-burger` | `nextrap-elements/nte-burger` | Burger-/Menu-Button-Element |
| `@nextrap/nte-card` | `nextrap-elements/nte-card` | Card-Element |
| `@nextrap/nte-consent-blocker` | `nextrap-elements/nte-consent-blocker` | Consent-/Privacy-Blocker-Element |
| `@nextrap/nte-demo-viewer` | `nextrap-elements/nte-demo-viewer` | Demo-Viewer-Element |
| `@nextrap/nte-dialog` | `nextrap-elements/nte-dialog` | Dialog-/Modal-Element |
| `@nextrap/nte-dialog-component` | `nextrap-elements/nte-dialog-component` | Dialog-Komponentenbasis |
| `@nextrap/nte-element-highlighter` | `nextrap-elements/nte-element-highlighter` | Element-Highlighting |
| `@nextrap/nte-image` | `nextrap-elements/nte-image` | Bild-Element |
| `@nextrap/nte-infiniscroll` | `nextrap-elements/nte-infiniscroll` | Infinite-Scroll-Element |
| `@nextrap/nte-input` | `nextrap-elements/nte-input` | Aktuelles Input-/Form-Element |
| `@nextrap/nte-input-old` | `nextrap-elements/nte-input-old` | Legacy-Input-Element |
| `@nextrap/nte-multiselect` | `nextrap-elements/nte-multiselect` | Multiselect-Element |
| `@nextrap/nte-nav` | `nextrap-elements/nte-nav` | Navigation-Element, ältere Variante |
| `@nextrap/nte-nav-2` | `nextrap-elements/nte-nav-2` | Navigation-Element, aktuelle/alternative Variante |
| `@nextrap/nte-notifier` | `nextrap-elements/nte-notifier` | Notification-/Toast-Element; Element-Referenz |
| `@nextrap/nte-offcanvas` | `nextrap-elements/nte-offcanvas` | Offcanvas-/Drawer-Element |
| `@nextrap/nte-parallax-bg` | `nextrap-elements/nte-parallax-bg` | Parallax-Background-Element |
| `@nextrap/nte-progress` | `nextrap-elements/nte-progress` | Progress-/Fortschrittsanzeige |
| `@nextrap/nte-scroll-to-top` | `nextrap-elements/nte-scroll-to-top` | Scroll-to-top-Element |
| `@nextrap/nte-scrollspy` | `nextrap-elements/nte-scrollspy` | Scrollspy-/Active-section-Element |
| `@nextrap/nte-slider` | `nextrap-elements/nte-slider` | Slider-/Carousel-Element |
| `@nextrap/nte-spinner` | `nextrap-elements/nte-spinner` | Lade-Spinner |
| `@nextrap/nte-split-view` | `nextrap-elements/nte-split-view` | Split-View-Element |
| `@nextrap/nte-stepper` | `nextrap-elements/nte-stepper` | Stepper-/Wizard-Element |
| `@nextrap/nte-theme-switcher` | `nextrap-elements/nte-theme-switcher` | Theme-Switcher-Element |
| `@nextrap/nte-tree-node` | `nextrap-elements/nte-tree-node` | Tree-/Node-Element |
| `@nextrap/ntl-2col` | `nextrap-layout/ntl-2col` | Zwei-Spalten-Layout; Layout-Referenz |
| `@nextrap/ntl-card-grid` | `nextrap-layout/ntl-card-grid` | Card-Grid-Layout |
| `@nextrap/ntl-card-row` | `nextrap-layout/ntl-card-row` | Card-Row-Layout |
| `@nextrap/ntl-footer` | `nextrap-layout/ntl-footer` | Footer-Layout |
| `@nextrap/ntl-form` | `nextrap-layout/ntl-form` | Form-Layout |
| `@nextrap/ntl-hero` | `nextrap-layout/ntl-hero` | Hero-/Header-Layout |
| `@nextrap/style-base` | `nextrap-styles/style-base` | Globale `--nt-*` Design Tokens |
| `@nextrap/style-button` | `nextrap-styles/style-button` | Button-Styles und Mixins |
| `@nextrap/style-elements` | `nextrap-styles/style-elements` | Wiederverwendbare Element-Styles wie prose, table, container |
| `@nextrap/style-reset` | `nextrap-styles/style-reset` | Shadow-DOM-sicherer Reset |
| `@nextrap/style-switch` | `nextrap-styles/style-switch` | Accessible Switch-Styles |
| `@nextrap/style-typography` | `nextrap-styles/style-typography` | Typografie-Regeln |
| `@nextrap/style-utils` | `nextrap-styles/style-utils` | Utility-Klassen und Mixins |

## Common commands

```bash
nx dev <package>
nx build <package>
nx test <package>
nx lint <package>
nx show project <package>
```

Demo viewer / GitHub Pages build:

```bash
npm ci
npx vite build
```

## GitHub Actions

| Workflow | Purpose |
|---|---|
| `.github/workflows/ci.yml` | CI |
| `.github/workflows/publish-tags.yml` | tag/package publishing workflow |
| `.github/workflows/static.yml` | GitHub Pages static demo deploy |

`static.yml` installs with `npm ci` and builds the root Vite demo viewer.

## Frequently used files

| Path | Purpose |
|---|---|
| `AGENTS.md` | concise repo-specific agent rules |
| `package.json` | root npm dependencies, scripts, workspaces |
| `package-lock.json` | npm lockfile; inspect with targeted commands only |
| `nx.json` | Nx workspace config |
| `tsconfig.base.json` | `@nextrap/*` path aliases |
| `vite.config.ts` | root Vite demo viewer config |
| `README_STYLING.md` | styling guide |
| `docs/style-packages-architecture.md` | `@nextrap/style-*` architecture contract |
| `docs/nextrap-elements-concept.md` | dual-usage concept |
| `nextrap-base/nt-nx-generators/src/generators/` | generator templates for packages |
| `nextrap-layout/ntl-2col/` | layout reference component |
| `nextrap-elements/nte-notifier/` | element reference component |

## Dependency notes

- External npm dependencies are managed centrally in root `package.json`.
- Intra-repo imports should use `@nextrap/<package-name>` aliases, not relative cross-package paths.
- `@trunkjs/vite-demo-viewer` is a root dev dependency resolved from npm registry, not from a local `workspaces/trunkjs-monorepo` workspace.
- Determine package versions with targeted commands (`npm pkg get`, `npm ls`, `jq`, short Node scripts). Do not read full lockfiles unless a full lockfile analysis is explicitly requested.

## Package authoring reminders

- Package entrypoint: root `index.ts` next to `package.json`; implementation lives under `src/`.
- New package structure should follow generator templates.
- Keep package `.ai-usage-info.md` short and current when working on that package.
- Published packages should include package-local usage/theming skills where available.
