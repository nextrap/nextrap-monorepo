import './_virtual_tdemo-client-BQ75DL_E.js';
import './index-5uYvO--2.js';
import './index-l0sNRNKZ.js';
import { r as t } from './main-BPLQjBVH.js';
import './nextrap-element-BgVUIfl5.js';
import './property-pW3KQYk0.js';
import './state-BVZImsYv.js';
import { d as e } from './types-4rIte7rE.js';
const i = `<!doctype html>
<html lang="de">
  <body>
    <main class="demo-vertical">
      <h1>Vertikale Navigation</h1>
      <div class="demo-frame">
        <nte-nav-2 aria-label="Bereichsnavigation">
          <nte-nav-item href="/konto">Übersicht</nte-nav-item>
          <nte-nav-item>
            Profil
            <nte-nav-item href="/konto/profil/daten">Persönliche Daten</nte-nav-item>
            <nte-nav-item>
              Sicherheit
              <nte-nav-item href="/konto/profil/passwort">Passwort</nte-nav-item>
              <nte-nav-item href="/konto/profil/zwei-faktor">Zwei-Faktor-Anmeldung</nte-nav-item>
            </nte-nav-item>
          </nte-nav-item>
          <nte-nav-item href="/konto/rechnungen">Rechnungen</nte-nav-item>
        </nte-nav-2>
      </div>
    </main>
  </body>
</html>
`,
  s = e({
    title: 'Vertikal',
    description: 'Vertikale Pfadnavigation mit nach unten auf- und zuslidenden Inline-Unterpunkten',
    render(n) {
      t(n, i);
    },
  });
export { s as default };
