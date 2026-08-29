import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import './main.scss';

export default defineDemo({
  title: 'Live-Layout',
  description: 'Breite, Sichtbarkeit und Pinning ändern; Zeilen und native Events bleiben direkt nutzbar',
  render(root) {
    root.innerHTML = `
      <main class="nte-data-table-demo">
        <h1>Layout zur Laufzeit ändern</h1>
        <p>
          Die Controls ändern die originale Light-DOM-Tabelle. Der Mutation Observer synchronisiert nur die
          Layout-Metadaten; Controls und Events bleiben nativ.
        </p>

        <div class="demo-toolbar" role="group" aria-label="Tabellenlayout">
          <label for="customer-column-width">Kundenbreite</label>
          <input id="customer-column-width" data-width-control type="range" min="8" max="24" value="14" />
          <output data-width-output for="customer-column-width">14rem</output>
          <label><input data-hidden-control type="checkbox" /> Priorität ausblenden</label>
          <label>
            Gepinnte Spalten
            <select data-pinned-control>
              <option value="0">Keine</option>
              <option value="1" selected>Eine</option>
              <option value="2">Zwei</option>
            </select>
          </label>
          <button data-add-row type="button">Zeile ergänzen</button>
          <button data-refresh type="button">refresh()</button>
        </div>

        <nte-data-table height="18rem" pinned-columns="1" scroll-label="Live-Aufträge">
          <table>
            <caption>Live aktualisierte Aufträge</caption>
            <thead>
              <tr>
                <th scope="col" data-width="8rem">Auftrag</th>
                <th scope="col" data-width="14rem" data-customer-header>Kunde</th>
                <th scope="col" data-width="10rem">Status</th>
                <th scope="col" data-width="9rem" data-priority-header>Priorität</th>
                <th scope="col" data-width="13rem">Kontakt</th>
                <th scope="col" data-width="20rem">Notiz</th>
              </tr>
            </thead>
            <tbody data-live-body>
              <tr>
                <th scope="row">AU-101</th>
                <td>Aperture Labs</td>
                <td>
                  <select name="status-101" aria-label="Status von Auftrag AU-101">
                    <option>Neu</option>
                    <option>In Arbeit</option>
                    <option>Erledigt</option>
                  </select>
                </td>
                <td>Hoch</td>
                <td><a href="mailto:ada@example.test">Ada</a></td>
                <td>Native Links und Selects bleiben direkt bedienbar.</td>
              </tr>
              <tr>
                <th scope="row">AU-102</th>
                <td>Black Mesa</td>
                <td>
                  <select name="status-102" aria-label="Status von Auftrag AU-102">
                    <option>Neu</option>
                    <option selected>In Arbeit</option>
                    <option>Erledigt</option>
                  </select>
                </td>
                <td>Mittel</td>
                <td><a href="mailto:grace@example.test">Grace</a></td>
                <td>Die Tabelle wird nicht geklont und benötigt keine Event-Brücke.</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" data-row-count>2 Aufträge</th>
                <td>2 Kunden</td>
                <td><output data-event-output role="status" aria-live="polite">Noch keine Änderung</output></td>
                <td>Alle</td>
                <td>2 Kontakte</td>
                <td>DOM-Änderungen werden automatisch erkannt.</td>
              </tr>
            </tfoot>
          </table>
        </nte-data-table>
      </main>
    `;

    const dataTable = root.querySelector('nte-data-table');
    const customerHeader = root.querySelector<HTMLElement>('[data-customer-header]');
    const priorityHeader = root.querySelector<HTMLElement>('[data-priority-header]');
    const widthControl = root.querySelector<HTMLInputElement>('[data-width-control]');
    const widthOutput = root.querySelector<HTMLOutputElement>('[data-width-output]');
    const hiddenControl = root.querySelector<HTMLInputElement>('[data-hidden-control]');
    const pinnedControl = root.querySelector<HTMLSelectElement>('[data-pinned-control]');
    const addRowButton = root.querySelector<HTMLButtonElement>('[data-add-row]');
    const refreshButton = root.querySelector<HTMLButtonElement>('[data-refresh]');
    const body = root.querySelector<HTMLTableSectionElement>('[data-live-body]');
    const rowCount = root.querySelector<HTMLElement>('[data-row-count]');
    const eventOutput = root.querySelector<HTMLElement>('[data-event-output]');
    const sourceTable = dataTable?.querySelector('table');

    if (
      !dataTable ||
      !customerHeader ||
      !priorityHeader ||
      !widthControl ||
      !widthOutput ||
      !hiddenControl ||
      !pinnedControl ||
      !addRowButton ||
      !refreshButton ||
      !body ||
      !rowCount ||
      !eventOutput ||
      !sourceTable
    ) {
      return;
    }

    widthControl.addEventListener('input', () => {
      const width = `${widthControl.value}rem`;
      customerHeader.dataset['width'] = width;
      widthOutput.value = width;
    });

    hiddenControl.addEventListener('change', () => {
      priorityHeader.toggleAttribute('data-hidden', hiddenControl.checked);
    });

    pinnedControl.addEventListener('change', () => {
      dataTable.pinnedColumns = Number(pinnedControl.value);
    });

    addRowButton.addEventListener('click', () => {
      const number = 101 + body.rows.length;
      const row = body.insertRow();
      row.innerHTML = `
        <th scope="row">AU-${number}</th>
        <td>Neue Kundin ${body.rows.length}</td>
        <td>
          <select name="status-${number}" aria-label="Status von Auftrag AU-${number}">
            <option selected>Neu</option>
            <option>In Arbeit</option>
            <option>Erledigt</option>
          </select>
        </td>
        <td>Normal</td>
        <td><a href="mailto:neu-${number}@example.test">Kontakt</a></td>
        <td>Diese Zeile wurde direkt an das native tbody angehängt.</td>
      `;
      rowCount.textContent = `${body.rows.length} Aufträge`;
    });

    refreshButton.addEventListener('click', () => {
      dataTable.refresh();
      eventOutput.textContent = 'refresh() manuell ausgelöst';
    });

    sourceTable.addEventListener('change', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      eventOutput.textContent = `${target.name}: ${target.value} · isTrusted: ${event.isTrusted}`;
    });
  },
});
