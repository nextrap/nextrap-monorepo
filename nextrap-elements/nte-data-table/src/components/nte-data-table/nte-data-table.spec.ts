import { afterEach, describe, expect, it, vi } from 'vitest';

import type { TableDefinition } from '../../definitions/table-definition';
import { NteDataTableElement } from './nte-data-table';

interface Row {
  id: number;
  name: string;
  region: string;
}

const definition: TableDefinition<Row> = {
  id: 'rows',
  rowId: 'id',
  columns: [
    { id: 'hidden', header: 'Hidden', field: 'id', hidden: true, pinned: true },
    { id: 'id', header: 'ID', field: 'id', pinned: true, footer: (rows) => `${rows.length} rows` },
    { id: 'name', header: 'Name', field: 'name' },
    { id: 'region', header: 'Region', field: 'region' },
  ],
};

afterEach(() => document.body.replaceChildren());

describe('NteDataTableElement', () => {
  // Die Basistabelle stellt bei preventDefault den DOM vor dem nächsten Lit-Render wieder her.
  it('reorders data without mutating the input and preserves cell values after rendering', async () => {
    const element = new NteDataTableElement<Row>();
    element.definition = definition;
    const original = [
      { id: 1, name: 'Ada', region: 'EU' },
      { id: 2, name: 'Grace', region: 'US' },
      { id: 3, name: 'Linus', region: 'EU' },
    ];
    element.data = original;
    document.body.append(element);
    await element.updateComplete;
    const table = element.renderRoot.querySelector('nte-table')!;
    const changed = vi.fn();
    element.addEventListener('nte-data-table-row-reorder', changed);
    const event = new CustomEvent('nte-table-row-reorder', {
      bubbles: true, composed: true, cancelable: true, detail: { from: 0, to: 2 },
    });
    expect(table.dispatchEvent(event)).toBe(false);
    expect(original.map(row => row.id)).toEqual([1, 2, 3]);
    expect(element.data.map(row => row.id)).toEqual([2, 3, 1]);
    expect(changed).toHaveBeenCalledOnce();
    expect(changed.mock.calls[0][0].detail).toEqual({ from: 0, to: 2, data: element.data });
    await element.updateComplete;
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    expect(rows.map(row => row.getAttribute('data-row-id'))).toEqual(['2', '3', '1']);
    expect(rows.map(row => row.cells[2].textContent)).toEqual(['Grace', 'Linus', 'Ada']);
    table.dispatchEvent(new CustomEvent('nte-table-row-reorder', {
      cancelable: true, detail: { from: 2, to: 0 },
    }));
    await element.updateComplete;
    expect(element.data.map(row => row.id)).toEqual([1, 2, 3]);
  });

  // Die Datentabelle delegiert Geometrie einschließlich Grenzen und Benutzer-Overrides an nte-table.
  it('passes fractional widths and bounds through while preserving pixel overrides', async () => {
    const element = new NteDataTableElement<Row>();
    element.definition = { id: 'widths', rowId: 'id', columns: [
      { id: 'id', header: 'ID', field: 'id', width: '100px' },
      { id: 'name', header: 'Name', field: 'name', width: '2fr', minWidth: 80, maxWidth: 320 },
      { id: 'region', header: 'Region', field: 'region', width: '20%' },
    ] };
    document.body.append(element);
    await element.updateComplete;
    const headers = element.renderRoot.querySelectorAll('th');
    expect(Array.from(headers, header => header.dataset.width)).toEqual(['100px', '2fr', '20%']);
    expect(headers[1].dataset.minWidth).toBe('80');
    expect(headers[1].dataset.maxWidth).toBe('320');
    element.setViewState({ columnWidths: { name: 180 } });
    await element.updateComplete;
    expect(headers[1].dataset.width).toBe('180');
  });

  // Tabellenstandard und Spalten-Override steuern Header und interaktive Zustandsänderungen gleich.
  it.each([
    { defaultSortable: undefined, sortable: undefined, enabled: true },
    { defaultSortable: false, sortable: undefined, enabled: false },
    { defaultSortable: false, sortable: true, enabled: true },
    { defaultSortable: true, sortable: false, enabled: false },
    { defaultSortable: true, sortable: undefined, enabled: true },
    { defaultSortable: undefined, sortable: false, enabled: false },
  ])('resolves sorting permissions: %o', async ({ defaultSortable, sortable, enabled }) => {
    const element = new NteDataTableElement<Row>();
    element.definition = {
      id: 'sorting', rowId: 'id', defaultSortable,
      columns: [{ id: 'name', header: 'Name', field: 'name', sortable }],
    };
    element.data = [{ id: 1, name: 'Ada', region: 'EU' }];
    document.body.append(element);
    await element.updateComplete;

    expect(element.renderRoot.querySelector('th')?.getAttribute('data-sortable'))
      .toBe(enabled ? null : 'false');
    const changed = vi.fn();
    element.addEventListener('nte-data-table-view-state-change', changed);
    element.renderRoot.querySelector('nte-table')!.dispatchEvent(new CustomEvent('nte-table-sort', {
      detail: { columnIndex: 0, direction: 'ascending' },
    }));
    expect(changed).toHaveBeenCalledTimes(enabled ? 1 : 0);
    expect(element.viewState.sort).toEqual(enabled ? [{ columnId: 'name', direction: 'ascending' }] : undefined);

    element.definition = { ...element.definition, defaultSortable: !enabled,
      columns: [{ id: 'name', header: 'Name', field: 'name' }] };
    await element.updateComplete;
    expect(element.renderRoot.querySelector('th')?.getAttribute('data-sortable'))
      .toBe(enabled ? 'false' : null);
  });

  it('pins leading visible definition columns and renders a footer', async () => {
    const element = new NteDataTableElement<Row>();
    element.definition = definition;
    element.data = [{ id: 1, name: 'Ada', region: 'EU' }];
    document.body.append(element);

    await element.updateComplete;

    const table = element.renderRoot.querySelector('nte-table');
    expect(table?.pinnedColumns).toBe(1);
    expect(element.renderRoot.querySelector('tfoot')?.textContent).toContain('1 rows');
  });

  // Der Refresh muss die bereits gerenderten neuen Zeilen sehen, nicht den vorherigen DOM-Stand.
  it('refreshes the inner table after adding and removing rows', async () => {
    const element = new NteDataTableElement<Row>();
    element.definition = definition;
    element.data = [{ id: 1, name: 'Ada', region: 'EU' }];
    document.body.append(element);
    await element.updateComplete;

    const table = element.renderRoot.querySelector('nte-table')!;
    const rowCounts: number[] = [];
    const refresh = vi.spyOn(table, 'refresh').mockImplementation(() => {
      rowCounts.push(table.querySelectorAll('tbody tr').length);
    });

    element.data = [...element.data, { id: 2, name: 'Grace', region: 'US' }];
    await element.updateComplete;
    expect(rowCounts).toEqual([2]);
    expect(table.querySelector('tbody')?.textContent).toContain('Grace');
    expect(table.querySelector('tfoot')?.textContent).toContain('2 rows');

    element.data = element.data.slice(1);
    await element.updateComplete;
    expect(rowCounts).toEqual([2, 1]);
    expect(table.querySelector('tbody')?.textContent).not.toContain('Ada');
    refresh.mockRestore();
  });

  it('lets view state override definition pin defaults', async () => {
    const element = new NteDataTableElement<Row>();
    element.definition = definition;
    element.data = [{ id: 1, name: 'Ada', region: 'EU' }];
    element.viewState = { pinnedColumns: ['id', 'name'] };
    document.body.append(element);

    await element.updateComplete;
    expect(element.renderRoot.querySelector('nte-table')?.pinnedColumns).toBe(2);

    element.setViewState({ pinnedColumns: [] });
    await element.updateComplete;
    expect(element.renderRoot.querySelector('nte-table')?.pinnedColumns).toBe(0);
  });
});
