/* empty css                */ /* empty css                */ import './_virtual_tdemo-client-CxMeb5Rk.js';
import './index-BR6EnczS.js';
import './nextrap-element-DeSHPIJn.js';
import './nte-table-CxwpBr-M.js'; /* empty css             */
import './property-C2fH_zxw.js'; /* empty css              */
import { d as l } from './types-4rIte7rE.js';
const c = Array.from({ length: 24 }, (r, t) => {
    const e = String(t + 1).padStart(3, '0'),
      n = ['Aperture Labs', 'Black Mesa', 'Cyberdyne Systems', 'Oceanic Airlines'][t % 4],
      o = ['Neu', 'In Arbeit', 'Wartet', 'Erledigt'][t % 4],
      a = ['Ada', 'Grace', 'Linus', 'Margaret'][t % 4],
      d = ['Nord', 'West', 'Süd', 'Ost'][t % 4],
      i = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(480 + t * 137.5);
    return `
    <tr>
      <th scope="row"><a href="#order-${e}">AU-${e}</a></th>
      <td>${n}</td>
      <td>
        <select name="status-${e}" aria-label="Status von Auftrag AU-${e}">
          <option${o === 'Neu' ? ' selected' : ''}>Neu</option>
          <option${o === 'In Arbeit' ? ' selected' : ''}>In Arbeit</option>
          <option${o === 'Wartet' ? ' selected' : ''}>Wartet</option>
          <option${o === 'Erledigt' ? ' selected' : ''}>Erledigt</option>
        </select>
      </td>
      <td>2026-08-${String((t % 28) + 1).padStart(2, '0')}</td>
      <td>${a}</td>
      <td>${d}</td>
      <td>${i}</td>
      <td><input type="checkbox" aria-label="Auftrag AU-${e} auswählen" /></td>
      <td>Planung und Abstimmung für Arbeitspaket ${e}</td>
    </tr>
  `;
  }).join(''),
  y = l({
    title: 'Scroll-Viewport',
    description: 'Sticky Header und Footer, feste Breiten, zwei gepinnte Spalten und native Form Controls',
    render(r) {
      r.innerHTML = `
      <main class="nte-table-demo">
        <h1>NTE Table</h1>
        <p>
          Der Body scrollt vertikal und horizontal. Auftrag und Kunde bleiben links stehen; die ausgeblendete Region
          bleibt Bestandteil der originalen Light-DOM-Tabelle.
        </p>

        <nte-table height="22rem" pinned-columns="2" scroll-label="Aufträge">
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
            <tbody>${c}</tbody>
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
        </nte-table>
      </main>
    `;
      const t = r.querySelector('table'),
        e = r.querySelector('[data-selection-count]');
      t == null ||
        t.addEventListener('change', (n) => {
          if (!(n.target instanceof HTMLInputElement) || n.target.type !== 'checkbox' || !e) return;
          const o = t.querySelectorAll('tbody input[type="checkbox"]:checked').length;
          e.textContent = `${o} gewählt`;
        });
    },
  });
export { y as default };
