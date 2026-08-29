import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import type { NteTableElement } from '../src/components/nte-table/nte-table';
import './main.scss';

const people = [
  ['u-101', 'Ada Lovelace', 'Platform', 'Aktiv'],
  ['u-102', 'Grace Hopper', 'Compiler', 'Review'],
  ['u-103', 'Margaret Hamilton', 'Runtime', 'Aktiv'],
  ['u-104', 'Radia Perlman', 'Network', 'Planung'],
  ['u-105', 'Barbara Liskov', 'Language', 'Aktiv'],
  ['u-106', 'Evelyn Boyd Granville', 'Research', 'Review'],
];

export default defineDemo({
  title: 'Fester Search-Header und Selection Remote',
  description: 'Toolbar oberhalb der Tabelle und programmatische Zeilen-/Spaltenselektion ohne Selection-Observer',
  render(root) {
    root.innerHTML = `
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
              <tbody>${people.map(([id, name, team, status]) => `<tr id="${id}" data-row-id="${id}"><th scope="row">${id.slice(2)}</th><td>${name}</td><td>${team}</td><td>${status}</td></tr>`).join('')}</tbody>
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

    const table = root.querySelector<NteTableElement>('#people-table');
    const search = root.querySelector<HTMLInputElement>('input[type="search"]');
    search?.addEventListener('input', () => {
      const query = search.value.trim().toLocaleLowerCase();
      table?.sourceTable?.tBodies[0]?.querySelectorAll('tr').forEach((row) => {
        row.hidden = query.length > 0 && !row.textContent?.toLocaleLowerCase().includes(query);
      });
    });
    root.querySelector('[data-action="row"]')?.addEventListener('click', () => table?.remote.toggleRow('u-103'));
    root.querySelector('[data-action="column"]')?.addEventListener('click', () => table?.remote.toggleColumn('status'));
    root.querySelector('[data-action="clear"]')?.addEventListener('click', () => table?.remote.clearSelection());
  },
});
