import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '@nextrap/ntl-2col';
import '../index';
import './main.scss';

export default defineDemo({
  title: 'Accordion in NTL 2col',
  description: 'Pairing des Accordions in der Haupt- und Seitenspalte eines Zweispalten-Layouts',
  render(root) {
    root.innerHTML = `
      <main class="nte-accordion-demo">
        <h1>Accordion und NTL 2col</h1>

        <section class="demo-card">
          <h2>Accordion im Hauptinhalt</h2>
          <ntl-2col style="--cols: 7">
            <nte-accordion initial-open-index="0" exclusive>
              <section><h3>Planung</h3><p>Das Accordion steht in der Hauptspalte.</p></section>
              <section><h3>Umsetzung</h3><p>Der ergänzende Inhalt bleibt in der Seitenspalte sichtbar.</p></section>
            </nte-accordion>
            <aside class="aside"><h3>Kontext</h3><p>Hier können Bild, Kontakt oder Zusatzinformationen stehen.</p></aside>
          </ntl-2col>
        </section>

        <section class="demo-card">
          <h2>Accordion in der Seitenspalte</h2>
          <ntl-2col style="--cols: 7">
            <div><h3>Hauptinhalt</h3><p>Der ausführliche Inhalt bleibt links, während kompakte Details rechts aufklappbar sind.</p></div>
            <nte-accordion class="aside" initial-open-index="0" exclusive>
              <section><h3>Seitliche Info</h3><p>Geeignet für Fakten und Downloads.</p></section>
              <section><h3>Weitere Details</h3><p>Auch ohne Bild bleibt die Seitenspalte sinnvoll nutzbar.</p></section>
            </nte-accordion>
          </ntl-2col>
        </section>
      </main>
    `;
  },
});
