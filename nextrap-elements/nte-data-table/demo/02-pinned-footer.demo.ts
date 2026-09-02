import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import type { NteDataTableElement, TableDefinition } from '../index';
import style from './main.scss?inline';

interface Order {
  id: string;
  customer: string;
  status: string;
  date: string;
  owner: string;
  region: string;
  amount: number;
  priority: string;
  note: string;
}

const customers = ['Aperture Labs', 'Black Mesa', 'Cyberdyne Systems', 'Oceanic Airlines'];
const statuses = ['Neu', 'In Arbeit', 'Wartet', 'Erledigt'];
const owners = ['Ada', 'Grace', 'Linus', 'Margaret'];
const regions = ['Nord', 'West', 'Süd', 'Ost'];
const priorities = ['Normal', 'Hoch', 'Kritisch'];
const data: Order[] = Array.from({ length: 60 }, (_, index) => ({
  id: `AU-${String(index + 1).padStart(3, '0')}`,
  customer: customers[index % customers.length],
  status: statuses[index % statuses.length],
  date: `2026-08-${String((index % 28) + 1).padStart(2, '0')}`,
  owner: owners[index % owners.length],
  region: regions[index % regions.length],
  amount: 480 + index * 137.5,
  priority: priorities[index % priorities.length],
  note: `Planung und Abstimmung für Arbeitspaket ${index + 1}`,
}));

const definition: TableDefinition<Order> = {
  id: 'orders',
  rowId: 'id',
  columns: [
    {
      id: 'id',
      header: 'Auftrag',
      field: 'id',
      defaultWidth: 110,
      pinned: true,
      footer: (rows) => `${rows.length} Aufträge`,
    },
    {
      id: 'customer',
      header: 'Kunde',
      field: 'customer',
      defaultWidth: 210,
      pinned: true,
      footer: (rows) => `${new Set(rows.map((row) => row.customer)).size} Kunden`,
    },
    { id: 'status', header: 'Status', field: 'status', defaultWidth: 140, footer: 'Alle Status' },
    { id: 'date', header: 'Datum', field: 'date', defaultWidth: 130, footer: 'August 2026' },
    { id: 'owner', header: 'Verantwortlich', field: 'owner', defaultWidth: 160, footer: `${owners.length} Personen` },
    { id: 'region', header: 'Region', field: 'region', defaultWidth: 100, footer: `${regions.length} Regionen` },
    {
      id: 'amount',
      header: 'Betrag',
      field: 'amount',
      defaultWidth: 130,
      preset: 'number',
      footer: (rows) =>
        new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(
          rows.reduce((sum, row) => sum + row.amount, 0),
        ),
    },
    { id: 'priority', header: 'Priorität', field: 'priority', defaultWidth: 110, footer: '' },
    {
      id: 'note',
      header: 'Notiz',
      field: 'note',
      defaultWidth: 320,
      footer: 'Sortieren, skalieren und Spalten verschieben',
    },
  ],
};

export default defineDemo({
  title: 'Fixierte Spalten und Footer',
  description: 'Große Tabelle mit 60 Zeilen, festem Footer und zwei fixierten führenden Spalten.',
  css: ['default', style],
  render(root) {
    root.innerHTML = `
      <main class="nte-data-table-demo">
        <h1>Aufträge</h1>
        <p>Beim horizontalen Scrollen bleiben Auftrag und Kunde sichtbar. Header und Footer liegen außerhalb des vertikalen Body-Viewports.</p>
        <nte-data-table height="28rem" scroll-label="Aufträge"></nte-data-table>
      </main>
    `;
    const table = root.querySelector<NteDataTableElement<Order>>('nte-data-table');
    if (!table) return;
    table.definition = definition;
    table.data = data;
  },
});
