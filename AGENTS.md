# AGENTS.md – AI Agent Guide for nextrap-monorepo

Diese Datei beschreibt, wie ein Coding-Agent in diesem Repository arbeiten soll.

## Grundprinzipien

- **Nicht unnötig kompliziert coden.** Bevorzuge einfache, gut lesbare und wartbare Lösungen.
- **Nicht alles komplett umbauen, wenn es nicht ausdrücklich verlangt ist.** Änderungen sollen so klein und zielgerichtet wie möglich bleiben.
- **Lieber nachfragen, wenn Anforderungen unklar sind.** Keine weitreichenden Annahmen treffen, wenn die Richtung nicht eindeutig ist.
- **Lieber früher stoppen und nachfragen, ob weitergemacht werden soll.** Besonders bei größeren Refactorings, strukturellen Änderungen oder Folgearbeiten.
- **An bestehendem Code orientieren.** Nutze vorhandene Patterns, Konventionen, Dateistrukturen und Stilmittel im Repository.

## Vorgehen bei Änderungen

- Arbeite bevorzugt **inkrementell** statt mit großen Rundum-Umbauten.
- Passe vorhandene Lösungen an, bevor du neue Abstraktionen oder neue Architekturen einführst.
- Vermeide "clevere" Lösungen, wenn eine einfache Lösung ausreicht.
- Halte Diffs klein und nachvollziehbar.
- Wenn eine Änderung potentiell mehrere sinnvolle Richtungen hat, stelle erst eine Rückfrage.

## Rückfragen sind besonders sinnvoll, wenn

- Anforderungen mehrdeutig sind.
- ein Refactoring über den eigentlichen Auftrag hinausgehen würde.
- bestehende Strukturen, APIs oder Dateiformate verändert werden müssten.
- zusätzliche Folgearbeiten naheliegen, aber nicht ausdrücklich beauftragt wurden.
- eine schnelle Minimaländerung ebenso möglich wäre wie eine größere "saubere" Lösung.

## Orientierung an bestehendem Repository-Kontext

- Bestehende Konventionen und Dokumentation im Repository haben Vorrang.
- Vorhandene Hilfsfunktionen, Utilities und Muster sollen bevorzugt wiederverwendet werden.
- Neue Strukturen nur dann einführen, wenn der vorhandene Aufbau dafür nicht geeignet ist.

## Ziel

Der Agent soll pragmatisch arbeiten: **einfach, passend zum Bestand, minimal-invasiv und mit rechtzeitigen Rückfragen statt unnötig großer Umbauten.**

## Die .ai-usage-info.md Datei

Diese Datei sollte für alle Pakete uptodate gehalten werden. In dieser sollten alle Informationen enthalten sein, um
die AI zu informieren, damit sie die Anforderungen der Pakete versteht und entsprechend coden kann. In dieser Datei
sollten hauptsächlich Beispiele enthalten sein. Suche ggf auch nach .ai-usage-info.md Dateien in anderen Paketen, um zu sehen, wie diese aufgebaut sind. (auch in node-modules)

## Orientierung

Orientiere dich beim Programmieren an Kompontneten wie nextrap-layout/ntl-2col und nextrap-elements/nte-notifier 


## Architecture Overview

Nx-managed npm monorepo with three package groups:

| Directory | Prefix | Purpose |
|---|---|---|
| `nextrap-base/` | `nt-*` | Shared utilities, styling foundations, generators |
| `nextrap-elements/` | `nte-*` | Lit web components (Shadow DOM) |
| `nextrap-layout/` | `ntl-*` | Layout-level web components |

All packages are independently versioned and published to npm under `@nextrap/`.

New Packages should comply with de .ai-agent-info.md of ntl-core (for layout) or nte-core (for elements).

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
- `nextrap-base/nt-nx-generators/` – Nx generator for scaffolding new packages (see these how to create new packages and follow their patterns)
- `nextrap-base/nt-nx-generators/src/generators/` – generator project templates that new projects should use as the primary reference/orientation
- `nextrap-base/style-base/` – global CSS variables / theming foundation (These may not be used inside of nte or ntl components - only defined once per Project)
- `nextrap-base/style-reset/` – Shadow DOM baseline reset (safe for Shadow DOM)
- `docs/nextrap-elements-concept.md` – dual-usage pattern explained
- `README_STYLING.md` – full component styling guide

