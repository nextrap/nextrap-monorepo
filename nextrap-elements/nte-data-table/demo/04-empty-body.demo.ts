import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';
import { dom } from '@trunkjs/browser-utils';
import { NteDataTableElement, type TableDefinition } from '../index';
import style from './main.scss?inline';

// Kleine Datenliste macht den Wechsel zwischen Inhalt und Leerzustand sichtbar.
interface Entry { id: number; title: string }

// Das Entfernen der letzten Zeile zeigt denselben Leerzustand erneut an.
export default defineDemo({
  title: 'Leerer Tabellenbody',
  description: 'empty-body füllt nur den Body; Header und Footer bleiben sichtbar.',
  css: ['default', style],
  render(root) {
    let nextId = 1;
    const table = new NteDataTableElement<Entry>();
    table.height = '16rem';
    table.scrollLabel = 'Meldungen';
    // Das Slot-Markup bleibt außerhalb der Daten und enthält eine normale Geschäftsaktion.
    table.append(dom`<div slot="empty-body"><p>Keine Einträge</p>
      <button type="button" @click=${() => {
        table.data = [...table.data, { id: nextId++, title: 'Neue Meldung' }];
      }}>Meldung hinzufügen</button></div>`);
    table.definition = {
      id: 'empty-body-demo', rowId: 'id',
      columns: [
        { id: 'title', header: 'Meldung', field: 'title', footer: rows => `${rows.length} Einträge` },
        { id: 'actions', header: 'Aktionen', width: '120px',
          // Jede Aktion ändert nur das Datenarray, nicht die gerenderten Tabellenzeilen.
          render: (_value, row) => dom`<button type="button" @click=${() => {
            table.data = table.data.filter(entry => entry.id !== row.id);
          }}>Entfernen</button>`,
        },
      ],
    } satisfies TableDefinition<Entry>;
    root.append(table);
  },
});
