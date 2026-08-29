import './_virtual_tdemo-client-BQ75DL_E.js';
import { d as o } from './types-4rIte7rE.js'; /* empty css                */ /* empty css              */ /* empty css                */
const d = `
.style-switch-demo {
  display: grid;
  gap: 2rem;
  max-width: 760px;
  padding: 1.5rem;
  color: var(--nt-text);
  background: var(--nt-surface);
  border: 1px solid var(--nt-border);
  border-radius: var(--nt-border-radius-lg, .75rem);
  transition: background-color 180ms ease, color 180ms ease;
}

.style-switch-demo[data-nt-scheme='light'] {
  color-scheme: light;
}

.style-switch-demo[data-nt-scheme='dark'] {
  color-scheme: dark;
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

.style-switch-demo__theme-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.style-switch-demo__theme-option {
  display: grid;
  place-items: center;
  gap: .5rem;
  min-height: 6rem;
  padding: 1rem;
  background: var(--nt-surface-raised);
  border: 1px solid var(--nt-border);
  border-radius: var(--nt-border-radius, .5rem);
}

.style-switch-demo__theme-option small,
.style-switch-demo__hint {
  color: var(--nt-text-muted, #6c757d);
  font-size: .875rem;
}

.style-switch-demo__stack {
  display: grid;
  gap: .75rem;
}

.style-switch-demo__hint {
  margin: -.35rem 0 0 calc(2.5rem + .625rem);
}

.style-switch-demo__scheme-status {
  margin: 0;
  font-weight: 600;
}
`,
  t = `
  <span data-switch-theme-icon="light" aria-hidden="true">
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41"></path>
    </svg>
  </span>
`,
  a = `
  <span data-switch-theme-icon="dark" aria-hidden="true">
    <svg viewBox="0 0 24 24">
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"></path>
    </svg>
  </span>
`,
  p = `
  <div class="style-switch-demo" data-theme-preview data-nt-scheme="light">
    <section>
      <h2>Light/Dark Theme Switches</h2>
      <p id="theme-switch-help">Sonne bedeutet Light Theme, Mond bedeutet Dark Theme. Alle Varianten steuern dieselbe Vorschau.</p>
      <div class="style-switch-demo__theme-row">
        <div class="style-switch-demo__theme-option">
          <label class="switch switch-theme switch-sm" title="Kompakter Theme Switch">
            <input class="switch-input" type="checkbox" role="switch" aria-label="Dunkles Farbschema" aria-describedby="theme-switch-help" data-theme-switch />
            <span class="switch-control" aria-hidden="true"></span>
            ${t}
            ${a}
          </label>
          <small>Compact</small>
        </div>

        <div class="style-switch-demo__theme-option">
          <label class="switch switch-theme">
            <input class="switch-input" type="checkbox" role="switch" aria-describedby="theme-switch-help" data-theme-switch />
            <span class="switch-control" aria-hidden="true"></span>
            ${t}
            ${a}
            <span class="switch-label">Farbschema</span>
          </label>
          <small>Default mit Label</small>
        </div>

        <div class="style-switch-demo__theme-option">
          <label class="switch switch-theme switch-material switch-lg" title="Material Theme Switch">
            <input class="switch-input" type="checkbox" role="switch" aria-label="Dunkles Farbschema" aria-describedby="theme-switch-help" data-theme-switch />
            <span class="switch-control" aria-hidden="true"></span>
            ${t}
            ${a}
          </label>
          <small>Material Large</small>
        </div>

        <div class="style-switch-demo__theme-option">
          <label class="switch switch-theme switch-outline switch-square switch-xl" title="Outline Theme Switch">
            <input class="switch-input" type="checkbox" role="switch" aria-label="Dunkles Farbschema" aria-describedby="theme-switch-help" data-theme-switch />
            <span class="switch-control" aria-hidden="true"></span>
            ${t}
            ${a}
          </label>
          <small>Outline Square XL</small>
        </div>
      </div>
      <p class="style-switch-demo__scheme-status">Aktiv: <output aria-live="polite" data-theme-output>Light Theme</output></p>
    </section>

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
        <label class="switch">
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
  g = o({
    title: 'Switches',
    group: 'style-switch',
    description: 'Barrierefreie Switches mit Größen-, Theme-, schlichten und dekorativen Varianten',
    css: ['default', d],
    render(s) {
      s.innerHTML = p;
      const c = s.querySelector('[data-theme-preview]'),
        i = s.querySelector('[data-theme-output]'),
        l = Array.from(s.querySelectorAll('[data-theme-switch]'));
      if (!c || !i) return;
      const h = (e) => {
        const n = e ? 'dark' : 'light';
        ((c.dataset.ntScheme = n),
          (c.style.colorScheme = n),
          (i.value = e ? 'Dark Theme' : 'Light Theme'),
          l.forEach((r) => {
            r.checked = e;
          }));
      };
      (l.forEach((e) => {
        e.addEventListener('change', () => h(e.checked));
      }),
        h(!1));
    },
  });
export { g as default };
