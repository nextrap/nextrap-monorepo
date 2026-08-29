/* empty css                */ /* empty css                */ import './_virtual_tdemo-client-BQ75DL_E.js';
import './index-BR6EnczS.js';
import './nextrap-element-BgVUIfl5.js';
import './nte-table-BXv9ynHN.js'; /* empty css             */
import './property-pW3KQYk0.js'; /* empty css              */
import { d as m } from './types-4rIte7rE.js';
const u = [
    ['u-101', 'Ada Lovelace', 'Platform', 'Aktiv'],
    ['u-102', 'Grace Hopper', 'Compiler', 'Review'],
    ['u-103', 'Margaret Hamilton', 'Runtime', 'Aktiv'],
    ['u-104', 'Radia Perlman', 'Network', 'Planung'],
    ['u-105', 'Barbara Liskov', 'Language', 'Aktiv'],
    ['u-106', 'Evelyn Boyd Granville', 'Research', 'Review'],
  ],
  T = m({
    title: 'Fester Search-Header und Selection Remote',
    description: 'Toolbar oberhalb der Tabelle und programmatische Zeilen-/Spaltenselektion ohne Selection-Observer',
    render(t) {
      var i, d, c;
      t.innerHTML = `
      <main class="nte-table-demo">
        <h1>Suche und Remote-Steuerung</h1>
        <section class="nte-table-example">
          <header class="nte-table-header">
            <div><strong>Teammitglieder</strong><br><small>6 Einträge</small></div>
            <label class="nte-table-search"><span>Suche</span><input type="search" placeholder="Name, Team oder Status" /></label>
          </header>
          <nte-table id="people-table" height="20rem" pinned-columns="1" scroll-label="Teammitglieder">
            <table>
              <thead><tr>
                <th class="border-free" data-column-id="id" data-width="6rem">ID</th>
                <th data-column-id="name" data-width="15rem">Name <span class="indicator">A–Z</span></th>
                <th data-column-id="team" data-width="12rem">Team</th>
                <th data-column-id="status" data-width="10rem">Status <span class="indicator">●</span></th>
              </tr></thead>
              <tbody>${u.map(([a, n, r, l]) => `<tr id="${a}" data-row-id="${a}"><th scope="row">${a.slice(2)}</th><td>${n}</td><td>${r}</td><td>${l}</td></tr>`).join('')}</tbody>
              <tfoot><tr><th>6</th><td>Personen</td><td>6 Teams</td><td>3 Zustände</td></tr></tfoot>
            </table>
          </nte-table>
        </section>
        <div class="demo-toolbar" aria-label="Selection-Demo">
          <button type="button" data-action="row">Zeile u-103 umschalten</button>
          <button type="button" data-action="column">Status-Spalte umschalten</button>
          <button type="button" data-action="clear">Auswahl löschen</button>
        </div>
      </main>`;
      const e = t.querySelector('#people-table'),
        o = t.querySelector('input[type="search"]');
      (o == null ||
        o.addEventListener('input', () => {
          var n, r;
          const a = o.value.trim().toLocaleLowerCase();
          (r = (n = e == null ? void 0 : e.sourceTable) == null ? void 0 : n.tBodies[0]) == null ||
            r.querySelectorAll('tr').forEach((l) => {
              var s;
              l.hidden = a.length > 0 && !((s = l.textContent) != null && s.toLocaleLowerCase().includes(a));
            });
        }),
        (i = t.querySelector('[data-action="row"]')) == null ||
          i.addEventListener('click', () => (e == null ? void 0 : e.remote.toggleRow('u-103'))),
        (d = t.querySelector('[data-action="column"]')) == null ||
          d.addEventListener('click', () => (e == null ? void 0 : e.remote.toggleColumn('status'))),
        (c = t.querySelector('[data-action="clear"]')) == null ||
          c.addEventListener('click', () => (e == null ? void 0 : e.remote.clearSelection())));
    },
  });
export { T as default };
