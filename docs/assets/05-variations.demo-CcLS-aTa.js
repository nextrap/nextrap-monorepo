import './_virtual_tdemo-client-CxMeb5Rk.js';
import './index-K51eAYk-.js';
import './index-l0sNRNKZ.js';
import { r as t } from './main-DR47ULvy.js';
import './nextrap-element-DeSHPIJn.js';
import './property-C2fH_zxw.js';
import './state-C6dwV5NT.js';
import { d as e } from './types-4rIte7rE.js';
const a = `<!doctype html>
<html lang="de">
  <body>
    <main class="demo-variations">
      <h1>Navigationsvariationen</h1>

      <div class="variations-grid">
        <section class="demo-frame variation variation-small">
          <h2>Kleine horizontale Navigation</h2>
          <nte-nav-2 aria-label="Servicenavigation">
            <nte-nav-item href="/hilfe">Hilfe</nte-nav-item>
            <nte-nav-item href="/kontakt">Kontakt</nte-nav-item>
            <nte-nav-item>
              Sprache
              <nte-nav-item href="/de" current="page">Deutsch</nte-nav-item>
              <nte-nav-item href="/en">English</nte-nav-item>
            </nte-nav-item>
          </nte-nav-2>
        </section>

        <section class="demo-frame variation variation-main">
          <h2>Große Hauptnavigation</h2>
          <nte-nav-2 aria-label="Hauptnavigation">
            <nte-nav-item href="/" current="page">Start</nte-nav-item>
            <nte-nav-item>
              Produkte
              <nte-nav-item href="/produkte/cloud">Cloud</nte-nav-item>
              <nte-nav-item href="/produkte/commerce">Commerce</nte-nav-item>
            </nte-nav-item>
            <nte-nav-item href="/unternehmen">
              Unternehmen
              <nte-nav-item href="/unternehmen/ueber-uns">Über uns</nte-nav-item>
              <nte-nav-item href="/unternehmen/karriere">Karriere</nte-nav-item>
            </nte-nav-item>
            <nte-nav-item href="/kontakt">Kontakt</nte-nav-item>
          </nte-nav-2>
        </section>

        <section class="demo-frame variation variation-subnav">
          <h2>Kompakte vertikale Pfadnavigation</h2>
          <nte-nav-2 aria-label="Dokumentationsnavigation">
            <nte-nav-item href="/docs">Einführung</nte-nav-item>
            <nte-nav-item>
              Komponenten
              <nte-nav-item href="/docs/button">Button</nte-nav-item>
              <nte-nav-item>
                Navigation
                <nte-nav-item href="/docs/nav/api">API</nte-nav-item>
                <nte-nav-item href="/docs/nav/styling">Styling</nte-nav-item>
              </nte-nav-item>
            </nte-nav-item>
            <nte-nav-item href="/docs/migration">Migration</nte-nav-item>
          </nte-nav-2>
        </section>

        <section class="demo-frame variation variation-responsive">
          <h2>Responsive mittelgroße Navigation</h2>
          <nte-nav-2 aria-label="Bereichsnavigation">
            <nte-nav-item href="/dashboard" order="10">Dashboard</nte-nav-item>
            <nte-nav-item order="20">
              Berichte
              <nte-nav-item href="/berichte/monat">Monatsbericht</nte-nav-item>
              <nte-nav-item href="/berichte/jahr">Jahresbericht</nte-nav-item>
            </nte-nav-item>
            <nte-nav-item href="/einstellungen" order="30">Einstellungen</nte-nav-item>
          </nte-nav-2>
        </section>
      </div>
    </main>
  </body>
</html>
`,
  l = e({
    title: 'Variationen',
    description: 'Größen, Varianten, verlinkte und nicht verlinkte Eltern sowie responsive Ausrichtung',
    render(n) {
      t(n, a);
    },
  });
export { l as default };
