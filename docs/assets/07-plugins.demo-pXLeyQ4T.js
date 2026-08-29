/* empty css                */ /* empty css                */ import './_virtual_tdemo-client-27TqdLsd.js';
import './index-BR6EnczS.js';
import './nextrap-element-DPUCZMMu.js';
import './nte-table-CaDYTzJL.js'; /* empty css             */
import './property-CGWbrx0V.js'; /* empty css              */
import { d as n } from './types-4rIte7rE.js';
const d = [
    ['P-104', 'Delta', '2026-09-12', '8400'],
    ['P-101', 'Alpha', '2026-08-30', '1250'],
    ['P-103', 'Charlie', '2026-09-04', '3100'],
    ['P-102', 'Bravo', '2026-09-01', '2750'],
  ]
    .map(
      ([r, e, a, t]) =>
        `<tr id="${r}"><th>${r}</th><td>${e}</td><td data-sort-value="${a}">${new Date(a).toLocaleDateString('de-DE')}</td><td data-sort-value="${t}">${Number(t).toLocaleString('de-DE')} €</td></tr>`,
    )
    .join(''),
  i = (r, e) => `
  <nte-table features="${r}" height="17rem" pinned-columns="1" scroll-label="${e}">
    <table>
      <caption>${e}</caption>
      <thead><tr>
        <th data-column-id="id" data-width="130">Projekt</th>
        <th data-column-id="name" data-width="190">Name</th>
        <th data-column-id="date" data-sort-type="date" data-width="170">Termin</th>
        <th data-column-id="amount" data-sort-type="number" data-width="160">Budget</th>
      </tr></thead>
      <tbody>${d}</tbody>
      <tfoot><tr><th>4</th><td>Projekte</td><td>Termine</td><td>15.500 €</td></tr></tfoot>
    </table>
  </nte-table>`,
  g = n({
    title: 'Table-Plugins',
    description: 'Sortierung sowie Spalten- und Zeilen-Reorder über das features-Attribut',
    render(r) {
      r.innerHTML = `
      <main class="nte-table-demo">
        <h1>Registrierbare Features</h1>
        <p>Die Plugins ändern ausschließlich die native Light-DOM-Tabelle. Sortierbuttons und Drag-Handles werden beim Aktivieren ergänzt und beim Deaktivieren entfernt.</p>
        <h2>Sortieren</h2>
        <p>Klicke auf den Indicator im Header. <code>data-sort-type</code> wählt String-, Zahlen- oder Datumssortierung.</p>
        ${i('sort', 'Sortierbare Projekte')}
        <h2>Spalten und Zeilen verschieben</h2>
        <p>Ziehe ausschließlich an den Griffen. Nach dem Drop wird das Pixel-Layout über <code>refresh()</code> neu vermessen.</p>
        ${i('reorder-columns reorder-rows', 'Verschiebbare Projekte')}
        <h2>Kombiniert</h2>
        ${i('sort reorder-columns reorder-rows', 'Alle Plugins kombiniert')}
        <output class="demo-plugin-events" data-plugin-events aria-live="polite">Noch keine Plugin-Aktion</output>
      </main>`;
      const e = r.querySelector('[data-plugin-events]');
      (r.addEventListener('nte-table-sort', (a) => {
        const t = a.detail;
        e && (e.value = `Spalte ${t.columnIndex + 1}: ${t.direction}`);
      }),
        r.addEventListener('nte-table-column-reorder', (a) => {
          const t = a.detail;
          e && (e.value = `Spalte ${t.from + 1} → ${t.to + 1}`);
        }),
        r.addEventListener('nte-table-row-reorder', (a) => {
          const t = a.detail;
          e && (e.value = `Zeile ${t.from + 1} → ${t.to + 1}`);
        }));
    },
  });
export { g as default };
