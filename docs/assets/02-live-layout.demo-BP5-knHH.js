/* empty css                */ /* empty css                */ import './_virtual_tdemo-client-Pi1VR-d9.js';
import './index-BR6EnczS.js';
import './nextrap-element-CnNsmvMM.js';
import './nte-table-bFtttMxQ.js'; /* empty css             */
import './property-BLTBoP6p.js'; /* empty css              */
import { d as m } from './types-4rIte7rE.js';
const x = m({
  title: 'Live-Layout',
  description: 'Layoutwerte ändern und anschließend mit refresh() neu in Pixeln festschreiben',
  render(t) {
    var s, p;
    t.innerHTML = `
      <main class="nte-table-demo">
        <h1>Layout zur Laufzeit ändern</h1>
        <p>Die Controls ändern die originale Light-DOM-Tabelle. <code>refresh()</code> löst alte Layoutwerte, misst neu und schreibt alle Spalten als feste Pixelbreiten.</p>
        <div class="demo-toolbar" role="group" aria-label="Tabellenlayout">
          <label for="customer-column-width">Kundenbreite</label>
          <input id="customer-column-width" data-width-control type="range" min="128" max="384" value="224" />
          <output data-width-output for="customer-column-width">224px</output>
          <label><input data-hidden-control type="checkbox" /> Priorität ausblenden</label>
          <label>Gepinnte Spalten <select data-pinned-control><option value="0">Keine</option><option value="1" selected>Eine</option><option value="2">Zwei</option></select></label>
          <button data-add-row type="button">Zeile ergänzen</button>
          <button data-refresh type="button">refresh()</button>
        </div>
        <nte-table height="18rem" pinned-columns="1" scroll-label="Live-Aufträge">
          <table>
            <caption>Live aktualisierte Aufträge</caption>
            <thead><tr><th data-width="128">Auftrag</th><th data-width="224" data-customer-header>Kunde</th><th data-width="160">Status</th><th data-width="144" data-priority-header>Priorität</th><th data-width="208">Kontakt</th><th data-width="320">Notiz</th></tr></thead>
            <tbody data-live-body>
              <tr><th>AU-101</th><td>Aperture Labs</td><td>Neu</td><td>Hoch</td><td>Ada</td><td>Native Inhalte bleiben direkt bedienbar.</td></tr>
              <tr><th>AU-102</th><td>Black Mesa</td><td>In Arbeit</td><td>Mittel</td><td>Grace</td><td>Die Tabelle wird weder beobachtet noch geklont.</td></tr>
            </tbody>
            <tfoot><tr><th data-row-count>2 Aufträge</th><td>2 Kunden</td><td colspan="1">Status</td><td>Alle</td><td>2 Kontakte</td><td><output data-event-output>Pixelbreiten aktiv</output></td></tr></tfoot>
          </table>
        </nte-table>
      </main>`;
    const e = t.querySelector('nte-table'),
      i = t.querySelector('[data-customer-header]'),
      l = t.querySelector('[data-priority-header]'),
      a = t.querySelector('[data-width-control]'),
      u = t.querySelector('[data-width-output]'),
      r = t.querySelector('[data-hidden-control]'),
      o = t.querySelector('[data-pinned-control]'),
      d = t.querySelector('[data-live-body]'),
      h = t.querySelector('[data-row-count]'),
      c = t.querySelector('[data-event-output]');
    !e ||
      !i ||
      !l ||
      !a ||
      !u ||
      !r ||
      !o ||
      !d ||
      !h ||
      !c ||
      (a.addEventListener('input', () => {
        const n = `${a.value}px`;
        ((i.dataset.width = n), (u.value = n), e.refresh());
      }),
      r.addEventListener('change', () => {
        (l.toggleAttribute('data-hidden', r.checked), e.refresh());
      }),
      o.addEventListener('change', () => {
        e.pinnedColumns = Number(o.value);
      }),
      (s = t.querySelector('[data-add-row]')) == null ||
        s.addEventListener('click', () => {
          const n = 101 + d.rows.length,
            b = d.insertRow();
          ((b.innerHTML = `<th>AU-${n}</th><td>Neue Kundin</td><td>Neu</td><td>Normal</td><td>Kontakt</td><td>Direkt ergänzte Light-DOM-Zeile.</td>`),
            (h.textContent = `${d.rows.length} Aufträge`),
            e.refresh());
        }),
      (p = t.querySelector('[data-refresh]')) == null ||
        p.addEventListener('click', () => {
          (e.refresh(), (c.textContent = 'Neu gemessen und in Pixeln fixiert'));
        }));
  },
});
export { x as default };
