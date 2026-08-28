import { h as n } from './_virtual_tdemo-client-8tx_scwF.js';
import './index-D64-0tiN.js';
import { r as t } from './main-Cazcs_VE.js';
const r = `<!doctype html>
<html lang="de">
  <body>
    <main class="demo-responsive">
      <h1>Responsive Navigation</h1>
      <p>Unter 44rem vertikal, darüber horizontal. Kontakt ist visuell nach vorn sortiert.</p>
      <div class="demo-frame">
        <nte-nav-2 aria-label="Beispielnavigation">
          <nte-nav-item href="/leistungen" order="20">Leistungen</nte-nav-item>
          <nte-nav-item href="/ueber-uns" order="30">Über uns</nte-nav-item>
          <nte-nav-item href="/kontakt" order="10">Kontakt</nte-nav-item>
        </nte-nav-2>
      </div>
    </main>
  </body>
</html>
`,
  s = n({
    title: 'Responsive & Order',
    description: 'Mixin-gesteuerter Richtungswechsel und optionale Flex-Sortierung',
    render(e) {
      t(e, r);
    },
  });
export { s as default };
