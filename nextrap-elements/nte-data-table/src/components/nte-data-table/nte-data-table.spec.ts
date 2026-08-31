import { afterEach, describe, expect, it } from 'vitest';

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
