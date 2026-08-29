import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import './main.scss';

const rows = [
  ['P-104', 'Delta', '2026-09-12', '8400'],
  ['P-101', 'Alpha', '2026-08-30', '1250'],
  ['P-103', 'Charlie', '2026-09-04', '3100'],
  ['P-102', 'Bravo', '2026-09-01', '2750'],
].map(([id, name, date, amount]) => `<tr id="${id}"><th>${id}</th><td>${name}</td><td data-sort-value="${date}">${new Date(date).toLocaleDateString('de-DE')}</td><td data-sort-value="${amount}">${Number(amount).toLocaleString('de-DE')} €</td></tr>`).join('');

const table = (features: string, label: string) => `
  <nte-data-table features="${features}" height="17rem" pinned-columns="1" scroll-label="${label}">
    <table>
      <caption>${label}</caption>
      <thead><tr>
        <th data-column-id="id" data-width="130">Projekt</th>
        <th data-column-id="name" data-width="190">Name</th>
        <th data-column-id="date" data-sort-type="date" data-width="170">Termin</th>
        <th data-column-id="amount" data-sort-type="number" data-width="160">Budget</th>
      </tr></thead>
      <tbody>${rows}</tbody>
      <tfoot><tr><th>4</th><td>Projekte</td><td>Termine</td><td>15.500 €</td></tr></tfoot>
    </table>
  </nte-data-table>`;

export default defineDemo({
  title: 'Data-Table-Plugins',
  description: 'Sortierung sowie Spalten- und Zeilen-Reorder über das features-Attribut',
  render(root) {
    root.innerHTML = `
      <main class="nte-data-table-demo">
        <h1>Registrierbare Features</h1>
        <p>Die Plugins ändern ausschließlich die native Light-DOM-Tabelle. Sortierbuttons und Drag-Handles werden beim Aktivieren ergänzt und beim Deaktivieren entfernt.</p>
        <h2>Sortieren</h2>
        <p>Klicke auf den Indicator im Header. <code>data-sort-type</code> wählt String-, Zahlen- oder Datumssortierung.</p>
        ${table('sort', 'Sortierbare Projekte')}
        <h2>Spalten und Zeilen verschieben</h2>
        <p>Ziehe ausschließlich an den Griffen. Nach dem Drop wird das Pixel-Layout über <code>refresh()</code> neu vermessen.</p>
        ${table('reorder-columns reorder-rows', 'Verschiebbare Projekte')}
        <h2>Kombiniert</h2>
        ${table('sort reorder-columns reorder-rows', 'Alle Plugins kombiniert')}
        <output class="demo-plugin-events" data-plugin-events aria-live="polite">Noch keine Plugin-Aktion</output>
      </main>`;

    const output = root.querySelector<HTMLOutputElement>('[data-plugin-events]');
    root.addEventListener('nte-data-table-sort', (event) => {
      const detail = (event as CustomEvent<{ columnIndex: number; direction: string }>).detail;
      if (output) output.value = `Spalte ${detail.columnIndex + 1}: ${detail.direction}`;
    });
    root.addEventListener('nte-data-table-column-reorder', (event) => {
      const detail = (event as CustomEvent<{ from: number; to: number }>).detail;
      if (output) output.value = `Spalte ${detail.from + 1} → ${detail.to + 1}`;
    });
    root.addEventListener('nte-data-table-row-reorder', (event) => {
      const detail = (event as CustomEvent<{ from: number; to: number }>).detail;
      if (output) output.value = `Zeile ${detail.from + 1} → ${detail.to + 1}`;
    });
  },
});
