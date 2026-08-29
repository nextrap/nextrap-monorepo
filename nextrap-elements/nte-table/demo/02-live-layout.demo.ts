import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import './main.scss';

export default defineDemo({
  title: 'Live-Layout',
  description: 'Layoutwerte ändern und anschließend mit refresh() neu in Pixeln festschreiben',
  render(root) {
    root.innerHTML = `
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

    const table = root.querySelector('nte-table');
    const customerHeader = root.querySelector<HTMLElement>('[data-customer-header]');
    const priorityHeader = root.querySelector<HTMLElement>('[data-priority-header]');
    const widthControl = root.querySelector<HTMLInputElement>('[data-width-control]');
    const widthOutput = root.querySelector<HTMLOutputElement>('[data-width-output]');
    const hiddenControl = root.querySelector<HTMLInputElement>('[data-hidden-control]');
    const pinnedControl = root.querySelector<HTMLSelectElement>('[data-pinned-control]');
    const body = root.querySelector<HTMLTableSectionElement>('[data-live-body]');
    const rowCount = root.querySelector<HTMLElement>('[data-row-count]');
    const eventOutput = root.querySelector<HTMLElement>('[data-event-output]');
    if (!table || !customerHeader || !priorityHeader || !widthControl || !widthOutput || !hiddenControl || !pinnedControl || !body || !rowCount || !eventOutput) return;

    widthControl.addEventListener('input', () => {
      const width = `${widthControl.value}px`;
      customerHeader.dataset['width'] = width;
      widthOutput.value = width;
      table.refresh();
    });
    hiddenControl.addEventListener('change', () => {
      priorityHeader.toggleAttribute('data-hidden', hiddenControl.checked);
      table.refresh();
    });
    pinnedControl.addEventListener('change', () => { table.pinnedColumns = Number(pinnedControl.value); });
    root.querySelector('[data-add-row]')?.addEventListener('click', () => {
      const number = 101 + body.rows.length;
      const row = body.insertRow();
      row.innerHTML = `<th>AU-${number}</th><td>Neue Kundin</td><td>Neu</td><td>Normal</td><td>Kontakt</td><td>Direkt ergänzte Light-DOM-Zeile.</td>`;
      rowCount.textContent = `${body.rows.length} Aufträge`;
      table.refresh();
    });
    root.querySelector('[data-refresh]')?.addEventListener('click', () => {
      table.refresh();
      eventOutput.textContent = 'Neu gemessen und in Pixeln fixiert';
    });
  },
});
