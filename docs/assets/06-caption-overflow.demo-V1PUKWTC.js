/* empty css                */ /* empty css                */ import './_virtual_tdemo-client-CxMeb5Rk.js';
import './index-BR6EnczS.js';
import './nextrap-element-DeSHPIJn.js';
import './nte-table-CxwpBr-M.js'; /* empty css             */
import './property-C2fH_zxw.js'; /* empty css              */
import { d as l } from './types-4rIte7rE.js';
const o = Array.from(
    { length: 18 },
    (t, e) => `
  <tr data-search-row>
    <th>${1001 + e}</th>
    <td>${['Aperture Laboratories', 'Black Mesa Research Facility', 'Tyrell Corporation'][e % 3]}</td>
    <td class="${['overflow-ellipsis', 'overflow-clip', 'overflow-wrap'][e % 3]}">Diese sehr lange Beschreibung demonstriert das konfigurierbare Text-Overflow-Verhalten innerhalb einer fest vermessenen Tabellenzelle.</td>
    <td>${['Offen', 'In Arbeit', 'Erledigt'][e % 3]}</td>
  </tr>`,
  ).join(''),
  g = l({
    title: 'Feste Caption, Suche und mobiler Scrollindikator',
    description: 'Caption und Spaltenkopf bleiben stehen; Zellen zeigen Ellipsis, Clip oder Wrap',
    render(t) {
      t.innerHTML = `
      <main class="nte-table-demo">
        <h1>Caption als fester Tabellenkopf</h1>
        <nte-table height="24rem" pinned-columns="1" scroll-label="Aufträge mit Suchfeld">
          <table>
            <caption>
              <span class="demo-caption-copy"><strong>Aufträge</strong><small>Caption, Suche und Beschreibung bleiben oberhalb der Spalten sichtbar.</small></span>
              <label class="nte-table-search"><span>Suche</span><input data-caption-search type="search" placeholder="Auftrag oder Kunde" /></label>
            </caption>
            <thead><tr><th data-width="96">ID</th><th data-width="240">Kunde</th><th data-width="420">Beschreibung</th><th data-width="160">Status</th></tr></thead>
            <tbody>${o}</tbody>
            <tfoot><tr><th>18</th><td>3 Kunden</td><td>Ellipsis ist der Standard; einzelne Zellen überschreiben ihn.</td><td>3 Zustände</td></tr></tfoot>
          </table>
        </nte-table>
      </main>`;
      const e = t.querySelector('[data-caption-search]');
      e == null ||
        e.addEventListener('input', () => {
          const a = e.value.trim().toLocaleLowerCase();
          t.querySelectorAll('[data-search-row]').forEach((r) => {
            var n;
            r.hidden = a.length > 0 && !((n = r.textContent) != null && n.toLocaleLowerCase().includes(a));
          });
        });
    },
  });
export { g as default };
