import './_virtual_tdemo-client-Pi1VR-d9.js';
import './index-D4PUARzf.js';
import './index-l0sNRNKZ.js';
import { r as t } from './main-CteEXrX8.js';
import './nextrap-element-CnNsmvMM.js';
import './property-BLTBoP6p.js';
import './state-CNjn0hWp.js';
import { d as e } from './types-4rIte7rE.js';
const i = `<!doctype html>
<html lang="de">
  <body>
    <main class="demo-horizontal">
      <h1>Horizontale Hauptnavigation</h1>
      <div class="demo-frame">
        <nte-nav-2 aria-label="Hauptnavigation">
          <nte-nav-item href="/" current="page">
            <svg slot="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z" fill="currentColor" />
            </svg>
            Start
          </nte-nav-item>
          <nte-nav-item>
            Leistungen
            <nte-nav-item href="/leistungen/beratung">Beratung</nte-nav-item>
            <nte-nav-item href="/leistungen/entwicklung">
              Entwicklung
              <nte-nav-item href="/leistungen/entwicklung/web">Web</nte-nav-item>
              <nte-nav-item href="/leistungen/entwicklung/apps">Apps</nte-nav-item>
            </nte-nav-item>
          </nte-nav-item>
          <nte-nav-item href="/unternehmen">
            Unternehmen
            <nte-nav-item href="/unternehmen/ueber-uns">Über uns</nte-nav-item>
            <nte-nav-item href="/unternehmen/karriere">Karriere</nte-nav-item>
          </nte-nav-item>
          <nte-nav-item href="/kontakt">Kontakt</nte-nav-item>
        </nte-nav-2>
      </div>
    </main>
  </body>
</html>
`,
  h = e({
    title: 'Horizontal',
    description: 'Hauptnavigation mit Icons, nicht verlinkten Eltern und mehrstufigen Popup-Untermenüs',
    render(n) {
      t(n, i);
    },
  });
export { h as default };
