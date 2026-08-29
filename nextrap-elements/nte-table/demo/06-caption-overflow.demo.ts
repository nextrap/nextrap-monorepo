import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import './main.scss';

const rows = Array.from({ length: 18 }, (_, index) => `
  <tr data-search-row>
    <th>${1001 + index}</th>
    <td>${['Aperture Laboratories', 'Black Mesa Research Facility', 'Tyrell Corporation'][index % 3]}</td>
    <td class="${['overflow-ellipsis', 'overflow-clip', 'overflow-wrap'][index % 3]}">Diese sehr lange Beschreibung demonstriert das konfigurierbare Text-Overflow-Verhalten innerhalb einer fest vermessenen Tabellenzelle.</td>
    <td>${['Offen', 'In Arbeit', 'Erledigt'][index % 3]}</td>
  </tr>`).join('');

export default defineDemo({
  title: 'Feste Caption, Suche und mobiler Scrollindikator',
  description: 'Caption und Spaltenkopf bleiben stehen; Zellen zeigen Ellipsis, Clip oder Wrap',
  render(root) {
    root.innerHTML = `
      <main class="nte-table-demo">
        <h1>Caption als fester Tabellenkopf</h1>
        <nte-table height="24rem" pinned-columns="1" scroll-label="Aufträge mit Suchfeld">
          <table>
            <caption>
              <span class="demo-caption-copy"><strong>Aufträge</strong><small>Caption, Suche und Beschreibung bleiben oberhalb der Spalten sichtbar.</small></span>
              <label class="nte-table-search"><span>Suche</span><input data-caption-search type="search" placeholder="Auftrag oder Kunde" /></label>
            </caption>
            <thead><tr><th data-width="96">ID</th><th data-width="240">Kunde</th><th data-width="420">Beschreibung</th><th data-width="160">Status</th></tr></thead>
            <tbody>${rows}</tbody>
            <tfoot><tr><th>18</th><td>3 Kunden</td><td>Ellipsis ist der Standard; einzelne Zellen überschreiben ihn.</td><td>3 Zustände</td></tr></tfoot>
          </table>
        </nte-table>
      </main>`;

    const search = root.querySelector<HTMLInputElement>('[data-caption-search]');
    search?.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase();
      root.querySelectorAll<HTMLTableRowElement>('[data-search-row]').forEach((row) => {
        row.hidden = query.length > 0 && !row.textContent?.toLocaleLowerCase().includes(query);
      });
    });
  },
});
