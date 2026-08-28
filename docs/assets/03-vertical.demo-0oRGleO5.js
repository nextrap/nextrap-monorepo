import { h as e } from './_virtual_tdemo-client-8tx_scwF.js';
import './index-D64-0tiN.js';
import { r as t } from './main-Cazcs_VE.js';
const i = `<!doctype html>
<html lang="de">
  <body>
    <main class="demo-vertical">
      <h1>Vertikale Navigation</h1>
      <div class="demo-frame">
        <nte-nav-2 aria-label="Bereichsnavigation">
          <nte-nav-item href="/konto">Übersicht</nte-nav-item>
          <nte-nav-item href="/konto/profil">
            Profil
            <nte-nav-item href="/konto/profil/daten">Persönliche Daten</nte-nav-item>
            <nte-nav-item href="/konto/profil/sicherheit">Sicherheit</nte-nav-item>
          </nte-nav-item>
          <nte-nav-item href="/konto/rechnungen">Rechnungen</nte-nav-item>
        </nte-nav-2>
      </div>
    </main>
  </body>
</html>
`,
  m = e({
    title: 'Vertikal',
    description: 'Vertikale Unternavigation mit denselben Komponenten und einem anderen Layout-Mixin',
    render(n) {
      t(n, i);
    },
  });
export { m as default };
