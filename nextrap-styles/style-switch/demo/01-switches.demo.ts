import { defineDemo } from '@trunkjs/demo-viewer';

import '@nextrap/style-base/default';
import '@nextrap/style-reset';
import '@nextrap/style-typography/default';
import '../default.scss';

const demoCss = `
.style-switch-demo {
  display: grid;
  gap: 2rem;
  max-width: 760px;
}

.style-switch-demo section,
.style-switch-demo fieldset {
  display: grid;
  gap: .875rem;
  padding: 0;
  margin: 0;
  border: 0;
}

.style-switch-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 1.5rem;
  align-items: center;
}

.style-switch-demo__stack {
  display: grid;
  gap: .75rem;
}

.style-switch-demo__hint {
  margin: -.35rem 0 0 calc(2.5rem + .625rem);
  color: var(--nt-text-muted, #6c757d);
  font-size: .875rem;
}
`;

export default defineDemo({
  title: 'Switches',
  group: 'style-switch',
  description: 'Barrierefreie Switches mit Größen-, schlichten und dekorativen Varianten',
  css: ['default', demoCss],
  html: `
    <div class="style-switch-demo">
      <section>
        <h2>Standard mit sichtbarem Label</h2>
        <div class="style-switch-demo__stack">
          <label class="switch">
            <input class="switch-input" type="checkbox" role="switch" checked />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">E-Mail-Benachrichtigungen</span>
          </label>
          <label class="switch">
            <input class="switch-input" type="checkbox" role="switch" />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Automatische Updates</span>
          </label>
          <label class="switch" id="analytics-switch-label">
            <input class="switch-input" type="checkbox" role="switch" aria-describedby="analytics-switch-hint" />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Anonyme Nutzungsdaten</span>
          </label>
          <small class="style-switch-demo__hint" id="analytics-switch-hint">Hilft uns, Bedienungsprobleme zu erkennen.</small>
        </div>
      </section>

      <section>
        <h2>Styles</h2>
        <div class="style-switch-demo__row">
          <label class="switch">
            <input class="switch-input" type="checkbox" role="switch" checked />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Default</span>
          </label>
          <label class="switch switch-outline">
            <input class="switch-input" type="checkbox" role="switch" checked />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Outline</span>
          </label>
          <label class="switch switch-material">
            <input class="switch-input" type="checkbox" role="switch" checked />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Material</span>
          </label>
          <label class="switch switch-square">
            <input class="switch-input" type="checkbox" role="switch" checked />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Square</span>
          </label>
          <label class="switch switch-icon">
            <input class="switch-input" type="checkbox" role="switch" checked />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Icon</span>
          </label>
        </div>
      </section>

      <section>
        <h2>Größen</h2>
        <div class="style-switch-demo__row">
          <label class="switch switch-sm">
            <input class="switch-input" type="checkbox" role="switch" checked />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Small</span>
          </label>
          <label class="switch">
            <input class="switch-input" type="checkbox" role="switch" checked />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Default</span>
          </label>
          <label class="switch switch-lg switch-material">
            <input class="switch-input" type="checkbox" role="switch" checked />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Large Material</span>
          </label>
          <label class="switch switch-xl switch-icon">
            <input class="switch-input" type="checkbox" role="switch" checked />
            <span class="switch-control" aria-hidden="true"></span>
            <span class="switch-label">Extra Large Icon</span>
          </label>
        </div>
      </section>

      <fieldset>
        <legend>Zustände und Labelpositionen</legend>
        <label class="switch switch-label-start">
          <input class="switch-input" type="checkbox" role="switch" />
          <span class="switch-control" aria-hidden="true"></span>
          <span class="switch-label">Label vor dem Schalter</span>
        </label>
        <label class="switch">
          <input class="switch-input" type="checkbox" role="switch" disabled />
          <span class="switch-control" aria-hidden="true"></span>
          <span class="switch-label">Deaktiviert</span>
        </label>
        <label class="switch switch-icon" title="Ton ein- oder ausschalten">
          <input class="switch-input" type="checkbox" role="switch" aria-label="Ton" />
          <span class="switch-control" aria-hidden="true"></span>
        </label>
      </fieldset>
    </div>
  `,
});
