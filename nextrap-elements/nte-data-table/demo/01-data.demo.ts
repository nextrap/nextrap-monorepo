import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import type { NteDataTableElement, TableDefinition } from '../index';
import style from './main.scss?inline';

interface Customer {
  id: number;
  name: string;
  amount: number;
  active: boolean;
}

const data: Customer[] = [
  { id: 1, name: 'Ada GmbH', amount: 1200, active: true },
  { id: 2, name: 'Turing AG', amount: 850, active: false },
];
const definition: TableDefinition<Customer> = {
  id: 'customers',
  rowId: 'id',
  columns: [
    { id: 'name', header: 'Name', field: 'name', defaultWidth: 220 },
    { id: 'amount', header: 'Umsatz', field: 'amount', preset: 'number', defaultWidth: 140 },
    { id: 'active', header: 'Aktiv', field: 'active', preset: 'boolean', defaultWidth: 100 },
  ],
};

export default defineDemo({
  title: 'Basisdaten',
  description: 'Rendert eine kleine Objektliste mit typisierter Definition.',
  css: ['default', style],
  render(root) {
    root.innerHTML = `
      <main class="nte-data-table-demo">
        <h1>Data Table</h1>
        <p>Definition und Daten werden als Properties gesetzt.</p>
        <nte-data-table height="14rem"></nte-data-table>
      </main>
    `;
    const table = root.querySelector<NteDataTableElement<Customer>>('nte-data-table');
    if (!table) return;
    table.definition = definition;
    table.data = data;
  },
});
