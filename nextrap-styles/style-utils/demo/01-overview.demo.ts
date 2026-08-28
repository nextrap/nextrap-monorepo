import { defineDemo } from '@trunkjs/demo-viewer';

import '@nextrap/style-base/default';
import '@nextrap/style-reset';
import '@nextrap/style-typography/default';
import '../default.scss';

const demoCss = `
.style-utils-demo {
  display: grid;
  gap: 2rem;
  max-width: 960px;
}

.style-utils-demo__section {
  display: grid;
  gap: 1rem;
}

.style-utils-demo__swatch,
.style-utils-demo__box,
.style-utils-demo__column {
  min-block-size: 3rem;
}

.style-utils-demo__swatch,
.style-utils-demo__box {
  display: grid;
  place-items: center;
}

.style-utils-demo__column {
  display: grid;
  place-items: center;
  background: var(--nt-primary-subtle);
  border: 1px solid var(--nt-primary);
  border-radius: var(--nt-border-radius-sm, .25rem);
}

.style-utils-demo__height-stage {
  block-size: 8rem;
}
`;

export default defineDemo({
  title: 'Style Utils',
  group: 'style-utils',
  description: 'Grid, Flex, Spacing, Farben, Flächen, Borders, Text und Dimensionen',
  css: ['default', demoCss],
  html: `
    <div class="style-utils-demo">
      <section class="style-utils-demo__section">
        <h2>Grid und Gutters</h2>
        <div class="row g-3">
          <div class="col-4"><div class="style-utils-demo__column p-3">col-4</div></div>
          <div class="col-8"><div class="style-utils-demo__column p-3">col-8</div></div>
          <div class="col-3 offset-2"><div class="style-utils-demo__column p-3">offset-2 col-3</div></div>
          <div class="col"><div class="style-utils-demo__column p-3">col</div></div>
        </div>
      </section>

      <section class="style-utils-demo__section">
        <h2>Flex</h2>
        <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 border border-primary rounded-3 p-3">
          <span class="bg-primary text-white rounded-pill px-3 py-2">Start</span>
          <span class="bg-accent text-dark rounded-pill px-3 py-2">Mitte</span>
          <span class="bg-success text-white rounded-pill px-3 py-2">Ende</span>
        </div>
      </section>

      <section class="style-utils-demo__section">
        <h2>Farben und semantische Flächen</h2>
        <div class="row row-cols-3 g-2">
          <div><div class="style-utils-demo__swatch bg-primary text-white rounded-2 p-2">Primary</div></div>
          <div><div class="style-utils-demo__swatch bg-accent text-dark rounded-2 p-2">Accent</div></div>
          <div><div class="style-utils-demo__swatch bg-success text-white rounded-2 p-2">Success</div></div>
          <div><div class="style-utils-demo__swatch bg-info-subtle text-info rounded-2 p-2">Info subtle</div></div>
          <div><div class="style-utils-demo__swatch bg-warning-subtle text-warning rounded-2 p-2">Warning subtle</div></div>
          <div><div class="style-utils-demo__swatch bg-danger-subtle text-danger rounded-2 p-2">Danger subtle</div></div>
        </div>
        <div class="surface-dark rounded-3 p-4">
          <h3 class="mt-0">Surface Dark</h3>
          <p class="mb-0">Semantische Flächen setzen die passenden Text-, Header- und Link-Tokens im lokalen Kontext.</p>
        </div>
      </section>

      <section class="style-utils-demo__section">
        <h2>Spacing, Borders und Radius</h2>
        <div class="d-flex flex-wrap gap-3 align-items-center">
          <div class="style-utils-demo__box border border-primary rounded p-2">rounded</div>
          <div class="style-utils-demo__box border-2 border-accent rounded-3 p-3">rounded-3</div>
          <div class="style-utils-demo__box border-3 border-success rounded-pill px-4 py-2">rounded-pill</div>
          <div class="style-utils-demo__box border border-danger rounded-circle p-4">circle</div>
        </div>
      </section>

      <section class="style-utils-demo__section">
        <h2>Typografische Utilities</h2>
        <div class="border rounded-2 p-3">
          <p class="fs-3 fw-bold text-primary mb-2">Groß, fett und Primary</p>
          <p class="fst-italic lh-lg mb-2">Kursiver Text mit großzügiger Zeilenhöhe.</p>
          <p class="font-monospace text-uppercase mb-2">monospace uppercase</p>
          <p class="text-decoration-line-through text-danger mb-0">Nicht mehr aktuell</p>
        </div>
      </section>

      <section class="style-utils-demo__section">
        <h2>Listen und Tabellen</h2>
        <div class="row g-4">
          <div class="col-6">
            <ul class="list-checked">
              <li>Verfügbar</li>
              <li class="list-item-unavailable">Nicht verfügbar</li>
              <li class="list-item-removed">Entfernt</li>
            </ul>
          </div>
          <div class="col-6">
            <ul class="list-inline">
              <li>Alpha</li>
              <li>Beta</li>
              <li>Gamma</li>
            </ul>
          </div>
        </div>
        <table class="table table-bordered">
          <thead><tr><th scope="col">Utility</th><th scope="col">Wirkung</th></tr></thead>
          <tbody><tr><td>p-3</td><td>Padding</td></tr><tr><td>text-primary</td><td>Textfarbe</td></tr></tbody>
        </table>
      </section>

      <section class="style-utils-demo__section">
        <h2>Dimensionen und Color Scheme</h2>
        <div class="style-utils-demo__height-stage d-flex align-items-end gap-2 border rounded-2 p-2">
          <div class="w-25 h-25 bg-primary"></div>
          <div class="w-25 h-50 bg-accent"></div>
          <div class="w-25 h-75 bg-success"></div>
          <div class="w-25 h-100 bg-info"></div>
        </div>
        <div class="scheme-dark bg-dark text-white rounded-2 p-3">Explizites dunkles Farbschema</div>
      </section>
    </div>
  `,
});
