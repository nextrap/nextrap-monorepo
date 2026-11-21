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
    { id: 'name', header: 'Name', field: 'name', width: '2fr', minWidth: 160 },
    { id: 'amount', header: 'Umsatz', field: 'amount', preset: 'number', width: '30%', minWidth: 100, maxWidth: 240 },
    { id: 'active', header: 'Aktiv', field: 'active', preset: 'boolean', width: '100px' },
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
        <p>100px werden zuerst reserviert, Umsatz erhält 30% vom Rest und Name den übrigen Platz (2fr).</p>
        <nte-data-table height="14rem"></nte-data-table>
      </main>
    `;
    const table = root.querySelector<NteDataTableElement<Customer>>('nte-data-table');
    if (!table) return;
    table.definition = definition;
    table.data = data;
  },
});
