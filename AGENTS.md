:/# AGENTS.md – AI Agent Guide for nextrap-monorepo

## Architecture Overview

Nx-managed npm monorepo with three package groups:

| Directory | Prefix | Purpose |
|---|---|---|
| `nextrap-base/` | `nt-*` | Shared utilities, styling foundations, generators |
| `nextrap-elements/` | `nte-*` | Lit web components (Shadow DOM) |
| `nextrap-layout/` | `ntl-*` | Layout-level web components |

All packages are independently versioned and published to npm under `@nextrap/`.

## Key Developer Commands

```bash
nx dev <package>           # Start dev server (e.g. nx dev ntl-2col)
nx build <package>         # Build a single package
nx test <package>          # Run Vitest tests
nx lint <package>          # ESLint check
nx show project <package>  # List all available targets for a package

# Generate a new element package:
nx g @nextrap/nt-nx-generators:base --name nte-demo --path nextrap-elements/nte-demo

# Release (from main branch only):
nx release --skip-publish -p <package>
git push --follow-tags origin main
```

After generating a new package, run `npm i` to link workspace dependencies.

## Component Authoring (Lit)

Components use [Lit](https://lit.dev/) with Shadow DOM. Standard pattern:

```ts
import { LitElement, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import style from './nte-my-component.scss?inline'; // ?inline = CSS string, not injected

@customElement('nte-my-component')
export class NteMyComponent extends LitElement {
    static override styles = [unsafeCSS(style)];
}
```

- Import `@nextrap/style-reset` inside component `.scss` for baseline styles.
- Import `@nextrap/style-base` in the `.ts` file to inject global CSS variables into the Light DOM.
- **Never import `style-*` packages (except `style-reset`) inside the Shadow DOM.**

## Styling Conventions

- Define all component CSS variables in `:host { }` – this is the public theming API.
- Use default values from `@nextrap/style-base` variables (e.g. `var(--nt-primary)`).
- Reference shadow DOM elements by `id`, never by class.
- Add `part="..."` attributes to main shadow DOM elements for external styling.
- Use `::slotted()` only for top-level slotted elements (nested selectors don't work in Shadow DOM).
- For deep/nested slot styling, use Light DOM styles scoped to `nte-my-component { }`.
- Do **not** use `::part()` inside shadow DOM stylesheets.

## Dual Usage Pattern

Components support both declarative HTML and programmatic instantiation – both produce identical Light DOM:

```html
<!-- Declarative -->
<nte-card><h1 slot="title">Hello</h1></nte-card>
```
```js
// Programmatic
document.body.appendChild(new NteCard({ data: { title: 'Hello' } }));
```

## Path Aliases

All intra-repo imports use `@nextrap/<package-name>` aliases defined in `tsconfig.base.json`. When adding a new package, register its path alias there.

## External Dependencies

All npm dependencies are defined **only** in the root `package.json` (single version per dependency). Do not add `dependencies` to individual package `package.json` files for external packages.

## Key Files

- `tsconfig.base.json` – all `@nextrap/*` path aliases
- `nextrap-base/nt-nx-generators/` – Nx generator for scaffolding new packages
- `nextrap-base/nt-nx-generators/src/generators/` – generator project templates that new projects should use as the primary reference/orientation
- `nextrap-base/style-base/` – global CSS variables / theming foundation (These may not be used inside of nte or ntl components - only defined once per Project)
- `nextrap-base/style-reset/` – Shadow DOM baseline reset (safe for Shadow DOM)
- `docs/nextrap-elements-concept.md` – dual-usage pattern explained
- `README_STYLING.md` – full component styling guide

