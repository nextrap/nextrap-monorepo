import '@nextrap/style-base/default';
import '@nextrap/style-typography/default';
import { defineDemo } from '@trunkjs/demo-viewer';

import '../index';
import type { NteDataTableElement, TableDefinition, TableViewStateChangeDetail } from '../index';
import style from './main.scss?inline';

interface Service {
  id: string;
  service: string;
  team: string;
  status: 'Aktiv' | 'Wartung';
  requests: number;
  latency: number;
  region: string;
}

const data: Service[] = Array.from({ length: 24 }, (_, index) => ({
  id: `svc-${String(index + 1).padStart(2, '0')}`,
  service: ['Checkout', 'Search', 'Accounts', 'Notifications'][index % 4],
  team: ['Core', 'Storefront', 'Identity'][index % 3],
  status: index % 5 === 0 ? 'Wartung' : 'Aktiv',
  requests: 12500 + index * 875,
  latency: 42 + (index % 7) * 11,
  region: ['eu-central', 'eu-west', 'us-east'][index % 3],
}));

const statusRenderer = (value: unknown): Node => {
  const status = String(value);
  const element = document.createElement('span');
  element.className = 'status';
  element.dataset['active'] = String(status === 'Aktiv');
  element.textContent = status;
  return element;
};

const definition: TableDefinition<Service> = {
  id: 'services',
  rowId: 'id',
  columns: [
    { id: 'id', header: 'ID', field: 'id', defaultWidth: 110, pinned: true },
    { id: 'service', header: 'Service', field: 'service', defaultWidth: 190 },
    { id: 'team', header: 'Team', field: 'team', defaultWidth: 140 },
    { id: 'status', header: 'Status', field: 'status', defaultWidth: 130, render: statusRenderer },
    { id: 'requests', header: 'Requests', field: 'requests', defaultWidth: 140, preset: 'number' },
    { id: 'latency', header: 'Latenz (ms)', field: 'latency', defaultWidth: 130, preset: 'number' },
    { id: 'region', header: 'Region', field: 'region', defaultWidth: 150 },
  ],
};

export default defineDemo({
  title: 'View-State und Interaktionen',
  description: 'Variiert Pinning und Sichtbarkeit; Sortierung, Breiten und Reihenfolge werden als State ausgegeben.',
  css: ['default', style],
  render(root) {
    root.innerHTML = `
      <main class="nte-data-table-demo">
        <h1>Service-Status</h1>
        <p>Die Demo-Controls ändern den serialisierbaren View-State der Tabelle.</p>
        <nte-data-table height="22rem" scroll-label="Service-Status"></nte-data-table>
      </main>
    `;
    const table = root.querySelector<NteDataTableElement<Service>>('nte-data-table');
    if (!table) return;
    table.definition = definition;
    table.data = data;
    table.viewState = { hiddenColumns: ['region'] };
  },
  controls: {
    items: [
      {
        id: 'pin-one',
        type: 'button',
        label: 'Erste Spalte fixieren',
        onClick(_, env) {
          const table = env.query<NteDataTableElement<Service>>('nte-data-table');
          table.setViewState({ ...table.getViewState(), pinnedColumns: ['id'] });
        },
      },
      {
        id: 'pin-two',
        type: 'button',
        label: 'Erste zwei fixieren',
        onClick(_, env) {
          const table = env.query<NteDataTableElement<Service>>('nte-data-table');
          table.setViewState({ ...table.getViewState(), pinnedColumns: ['id', 'service'] });
        },
      },
      {
        id: 'pin-none',
        type: 'button',
        label: 'Keine fixieren',
        onClick(_, env) {
          const table = env.query<NteDataTableElement<Service>>('nte-data-table');
          table.setViewState({ ...table.getViewState(), pinnedColumns: [] });
        },
      },
      {
        id: 'show-region',
        type: 'checkbox',
        label: 'Region anzeigen',
        value: false,
        onChange(event, env) {
          const table = env.query<NteDataTableElement<Service>>('nte-data-table');
          const state = table.getViewState();
          table.setViewState({
            ...state,
            hiddenColumns: event.value
              ? (state.hiddenColumns ?? []).filter((id) => id !== 'region')
              : [...new Set([...(state.hiddenColumns ?? []), 'region'])],
          });
        },
      },
      {
        id: 'reset',
        type: 'button',
        label: 'State zurücksetzen',
        onClick(_, env) {
          env.query<NteDataTableElement<Service>>('nte-data-table').setViewState({});
          env.controls.setValue('show-region', true);
        },
      },
      { id: 'state', type: 'json', label: 'TableViewState', readonly: true, value: {} },
    ],
  },
  afterRender(env) {
    const table = env.query<NteDataTableElement<Service>>('nte-data-table');
    const updateState = (event: Event): void => {
      env.controls.setValue('state', (event as CustomEvent<TableViewStateChangeDetail>).detail.state);
    };
    table.addEventListener('nte-data-table-view-state-change', updateState);
    env.controls.setValue('state', table.getViewState());
    return () => table.removeEventListener('nte-data-table-view-state-change', updateState);
  },
});
