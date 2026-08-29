import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import './main.scss';

const rows = Array.from({ length: 24 }, (_, index) => {
  const number = String(index + 1).padStart(3, '0');
  const customer = ['Aperture Labs', 'Black Mesa', 'Cyberdyne Systems', 'Oceanic Airlines'][index % 4];
  const status = ['Neu', 'In Arbeit', 'Wartet', 'Erledigt'][index % 4];
  const owner = ['Ada', 'Grace', 'Linus', 'Margaret'][index % 4];
  const region = ['Nord', 'West', 'Süd', 'Ost'][index % 4];
  const amount = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
    480 + index * 137.5,
  );

  return `
    <tr>
      <th scope="row"><a href="#order-${number}">AU-${number}</a></th>
      <td>${customer}</td>
      <td>
        <select name="status-${number}" aria-label="Status von Auftrag AU-${number}">
          <option${status === 'Neu' ? ' selected' : ''}>Neu</option>
          <option${status === 'In Arbeit' ? ' selected' : ''}>In Arbeit</option>
          <option${status === 'Wartet' ? ' selected' : ''}>Wartet</option>
          <option${status === 'Erledigt' ? ' selected' : ''}>Erledigt</option>
        </select>
      </td>
      <td>2026-08-${String((index % 28) + 1).padStart(2, '0')}</td>
      <td>${owner}</td>
      <td>${region}</td>
      <td>${amount}</td>
      <td><input type="checkbox" aria-label="Auftrag AU-${number} auswählen" /></td>
      <td>Planung und Abstimmung für Arbeitspaket ${number}</td>
    </tr>
  `;
}).join('');

export default defineDemo({
  title: 'Scroll-Viewport',
  description: 'Sticky Header und Footer, feste Breiten, zwei gepinnte Spalten und native Form Controls',
  render(root) {
    root.innerHTML = `
      <main class="nte-data-table-demo">
        <h1>NTE Data Table</h1>
        <p>
          Der Body scrollt vertikal und horizontal. Auftrag und Kunde bleiben links stehen; die ausgeblendete Region
          bleibt Bestandteil der originalen Light-DOM-Tabelle.
        </p>

        <nte-data-table height="22rem" pinned-columns="2" scroll-label="Aufträge">
          <table>
            <caption>Aktuelle Aufträge</caption>
            <thead>
              <tr>
                <th scope="col" data-width="8rem">Auftrag</th>
                <th scope="col" data-width="14rem">Kunde</th>
                <th scope="col" data-width="10rem">Status</th>
                <th scope="col" data-width="10rem">Datum</th>
                <th scope="col" data-width="10rem">Verantwortlich</th>
                <th scope="col" data-width="8rem" hidden>Region</th>
                <th scope="col" data-width="9rem">Betrag</th>
                <th scope="col" data-width="7rem">Auswahl</th>
                <th scope="col" data-width="22rem">Notiz</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
            <tfoot>
              <tr>
                <th scope="row">24 Aufträge</th>
                <td>4 Kunden</td>
                <td>Alle Status</td>
                <td>August 2026</td>
                <td>4 Personen</td>
                <td>4 Regionen</td>
                <td>Gesamt</td>
                <td data-selection-count>0 gewählt</td>
                <td>Footer bleibt beim vertikalen Scrollen sichtbar</td>
              </tr>
            </tfoot>
          </table>
        </nte-data-table>
      </main>
    `;

    const sourceTable = root.querySelector('table');
    const selectionCount = root.querySelector<HTMLElement>('[data-selection-count]');

    sourceTable?.addEventListener('change', (event) => {
      if (!(event.target instanceof HTMLInputElement) || event.target.type !== 'checkbox' || !selectionCount) return;
      const selected = sourceTable.querySelectorAll<HTMLInputElement>('tbody input[type="checkbox"]:checked').length;
      selectionCount.textContent = `${selected} gewählt`;
    });
  },
});
