import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import './main.scss';

const accordion = (attributes = '', className = '') => `
  <nte-accordion class="${className}" ${attributes}>
    <section>
      <h3>Was macht nte-accordion?</h3>
      <p>Direkte section-Kinder werden zu zugänglichen, aufklappbaren Accordion-Items.</p>
    </section>
    <section>
      <h3>Wie wird ein Eintrag geöffnet?</h3>
      <p>Ein Klick auf die Überschrift ändert den reflektierten open-Zustand des Items.</p>
    </section>
    <section>
      <h3>Woher kommt das Styling?</h3>
      <p>Das visuelle Styling wird über die öffentliche Sass-API und Shadow Parts eingebunden.</p>
    </section>
  </nte-accordion>
`;

export default defineDemo({
  title: 'Accordion',
  description: 'Grundverhalten, Initialzustand, exklusives Öffnen und Marker-Varianten',
  render(root) {
    root.innerHTML = `
      <main class="nte-accordion-demo">
        <h1>NTE Accordion</h1>
        <p>Das Accordion eignet sich für FAQ- und Detailbereiche innerhalb eines bestehenden Layouts.</p>

        <section class="demo-card">
          <h2>Standard</h2>
          ${accordion('initial-open-index="0" exclusive')}
        </section>

        <section class="demo-card">
          <h2>Mehrere offene Einträge</h2>
          <p>Ohne <code>exclusive</code> können mehrere Einträge gleichzeitig geöffnet bleiben.</p>
          ${accordion('initial-open-index="1"')}
        </section>

        <section class="demo-card">
          <h2>Marker links als Plus und Minus</h2>
          ${accordion('initial-open-index="0" marker-position="start" marker-icon="plus"', 'marker-start marker-plus')}
        </section>

        <section class="demo-card demo-compact">
          <h2>Kompakte Theme-Komposition</h2>
          ${accordion('initial-open-index="0"')}
        </section>
      </main>
    `;
  },
});
