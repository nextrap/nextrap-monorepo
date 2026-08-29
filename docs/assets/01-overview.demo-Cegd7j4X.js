import './_virtual_tdemo-client-Pi1VR-d9.js';
import { d as e } from './types-4rIte7rE.js'; /* empty css                */ /* empty css              */ /* empty css                */
const n = `{: layout="1;.container" }

# Style Utils

\`@nextrap/style-utils\` stellt atomare Klassen bereit, die direkt im Markup miteinander kombiniert werden.

## Grid und Gutters

<div class="row g-3">
  <div class="col-4"><div class="surface-primary rounded p-3 text-center">col-4</div></div>
  <div class="col-8"><div class="surface-primary rounded p-3 text-center">col-8</div></div>
  <div class="col-3 offset-2"><div class="surface-primary rounded p-3 text-center">offset-2 col-3</div></div>
  <div class="col"><div class="surface-primary rounded p-3 text-center">col</div></div>
</div>

## Flex

<div class="d-flex flex-wrap justify-content-between align-items-center gap-3 border border-primary rounded-3 p-3">
  <span class="surface-primary rounded-pill px-3 py-2">Start</span>
  <span class="surface-accent rounded-pill px-3 py-2">Mitte</span>
  <span class="surface-success rounded-pill px-3 py-2">Ende</span>
</div>

## Farben und semantische Flächen

<div class="row row-cols-3 g-2">
  <div><div class="surface-primary rounded-2 p-2 text-center">Primary</div></div>
  <div><div class="surface-accent rounded-2 p-2 text-center">Accent</div></div>
  <div><div class="surface-success rounded-2 p-2 text-center">Success</div></div>
  <div><div class="bg-info-subtle text-info rounded-2 p-2 text-center">Info subtle</div></div>
  <div><div class="bg-warning-subtle text-warning rounded-2 p-2 text-center">Warning subtle</div></div>
  <div><div class="bg-danger-subtle text-danger rounded-2 p-2 text-center">Danger subtle</div></div>
</div>

<div class="surface-dark rounded-3 p-4 mt-3">
  <h3 class="mt-0">Surface Dark</h3>
  <p class="mb-0">Semantische Flächen setzen die passenden Text-, Header- und Link-Tokens im lokalen Kontext.</p>
</div>

## Spacing, Borders und Radius

<div class="d-flex flex-wrap gap-3 align-items-center">
  <div class="border border-primary rounded p-2">rounded</div>
  <div class="border-2 border-accent rounded-3 p-3">rounded-3</div>
  <div class="border-3 border-success rounded-pill px-4 py-2">rounded-pill</div>
  <div class="border border-danger rounded-circle p-4">circle</div>
</div>

## Typografische Utilities

Groß, fett und Primary
{: .fs-3 .fw-bold .text-primary .mb-2 }

Kursiver Text mit großzügiger Zeilenhöhe.
{: .fst-italic .lh-lg .mb-2 }

Monospace uppercase
{: .font-monospace .text-uppercase .mb-2 }

Nicht mehr aktuell
{: .text-decoration-line-through .text-danger }

## Listen und Tabellen

<ul class="list-checked">
  <li>Verfügbar</li>
  <li class="list-item-unavailable">Nicht verfügbar</li>
  <li class="list-item-removed">Entfernt</li>
</ul>

- Alpha
- Beta
- Gamma
{: .list-inline }

| Utility | Wirkung |
| --- | --- |
| \`p-3\` | Padding |
| \`text-primary\` | Textfarbe |
{: .table .table-bordered }

## Dimensionen und Color Scheme

<div class="d-flex align-items-end gap-2 border rounded-2 p-2" style="height: 8rem">
  <div class="w-25 h-25 bg-primary"></div>
  <div class="w-25 h-50 bg-accent"></div>
  <div class="w-25 h-75 bg-success"></div>
  <div class="w-25 h-100 bg-info"></div>
</div>

<div class="scheme-dark surface-dark rounded-2 p-3 mt-3">Explizites dunkles Farbschema</div>
`,
  a = e({
    title: 'Style Utils',
    group: 'style-utils',
    description: 'Grid, Flex, Spacing, Farben, Flächen, Borders, Text und Dimensionen',
    css: ['default'],
    markdown: n,
  });
export { a as default };
