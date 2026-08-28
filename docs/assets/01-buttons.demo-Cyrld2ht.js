const t = `import { defineDemo } from '@trunkjs/demo-viewer';

import '@nextrap/style-base/default';
import '@nextrap/style-reset';
import '@nextrap/style-typography/default';
import '../default.scss';

const demoCss = \`
.style-button-demo {
  display: grid;
  gap: 1.5rem;
  max-width: 980px;
}

.style-button-demo section {
  display: grid;
  gap: .75rem;
}

.style-button-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
  align-items: center;
}

.style-button-demo__dropdown {
  display: inline-grid;
  gap: .5rem;
  max-width: 240px;
}
\`;

export default defineDemo({
  title: 'Buttons',
  group: 'style-button',
  description: 'Standard-, Outline-, Größen-, Lead-, Glow- und Gruppen-Varianten',
  css: ['default', demoCss],
  html: \`
    <div class="style-button-demo">
      <section>
        <h2>Button Elemente</h2>
        <div class="style-button-demo__row">
          <a class="btn btn-primary" href="#" role="button">Link</a>
          <button class="btn btn-primary" type="button">Button</button>
          <input class="btn btn-primary" type="button" value="Input" />
          <input class="btn btn-primary" type="submit" value="Submit" />
          <input class="btn btn-primary" type="reset" value="Reset" />
        </div>
      </section>

      <section>
        <h2>Varianten</h2>
        <div class="style-button-demo__row">
          <button class="btn" type="button">Default</button>
          <button class="btn btn-primary" type="button">Primary</button>
          <button class="btn btn-accent" type="button">Accent</button>
          <button class="btn btn-secondary" type="button">Secondary</button>
          <button class="btn btn-tertiary" type="button">Tertiary</button>
          <button class="btn btn-success" type="button">Success</button>
          <button class="btn btn-danger" type="button">Danger</button>
          <button class="btn btn-warning" type="button">Warning</button>
          <button class="btn btn-info" type="button">Info</button>
          <button class="btn btn-light" type="button">Light</button>
          <button class="btn btn-dark" type="button">Dark</button>
          <button class="btn btn-link" type="button">Link</button>
        </div>
      </section>

      <section>
        <h2>Outline Varianten</h2>
        <div class="style-button-demo__row">
          <button class="btn btn-outline-primary" type="button">Primary</button>
          <button class="btn btn-outline-accent" type="button">Accent</button>
          <button class="btn btn-outline-secondary" type="button">Secondary</button>
          <button class="btn btn-outline-tertiary" type="button">Tertiary</button>
          <button class="btn btn-outline-success" type="button">Success</button>
          <button class="btn btn-outline-danger" type="button">Danger</button>
          <button class="btn btn-outline-warning" type="button">Warning</button>
          <button class="btn btn-outline-info" type="button">Info</button>
          <button class="btn btn-outline-light" type="button">Light</button>
          <button class="btn btn-outline-dark" type="button">Dark</button>
        </div>
      </section>

      <section>
        <h2>Größen</h2>
        <div class="style-button-demo__row">
          <button class="btn btn-primary btn-sm" type="button">Small</button>
          <button class="btn btn-primary" type="button">Default</button>
          <button class="btn btn-primary btn-lg" type="button">Large</button>
          <button class="btn btn-primary btn-xl" type="button">Extra Large</button>
          <button class="btn btn-primary btn-xxl" type="button">XXL</button>
        </div>
      </section>

      <section>
        <h2>Lead und Glow</h2>
        <div class="style-button-demo__row">
          <a class="btn btn-primary btn-lead btn-glow btn-glow-on-view" href="#">Termin vereinbaren</a>
          <a class="btn btn-outline-primary btn-lead btn-glow" href="#">Mehr erfahren</a>
          <button class="btn btn-secondary btn-glow" type="button">Hover Glow</button>
        </div>
      </section>

      <section>
        <h2>Disabled</h2>
        <div class="style-button-demo__row">
          <button class="btn btn-primary" type="button" disabled>Primary</button>
          <button class="btn btn-secondary" type="button" disabled>Secondary</button>
          <button class="btn btn-outline-primary" type="button" disabled>Outline</button>
        </div>
      </section>

      <section>
        <h2>Button Groups</h2>
        <div class="style-button-demo__row">
          <div class="btn-group" role="group" aria-label="Primary group">
            <button class="btn btn-primary" type="button">Links</button>
            <button class="btn btn-primary" type="button">Mitte</button>
            <button class="btn btn-primary" type="button">Rechts</button>
          </div>
          <div class="btn-group" role="group" aria-label="Outline group">
            <button class="btn btn-outline-primary" type="button">Links</button>
            <button class="btn btn-outline-primary" type="button">Mitte</button>
            <button class="btn btn-outline-primary" type="button">Rechts</button>
          </div>
        </div>
      </section>

      <section>
        <h2>Dropdown</h2>
        <div class="style-button-demo__dropdown">
          <button class="btn btn-primary dropdown-toggle" type="button">Dropdown Button</button>
          <ul class="dropdown-menu">
            <li><a href="#">Action</a></li>
            <li><a href="#">Another action</a></li>
            <li><hr /></li>
            <li><a href="#">Something else here</a></li>
          </ul>
        </div>
      </section>
    </div>
  \`,
});
`;
export { t as default };
