import { type NteDataTablePlugin, type NteDataTablePluginContext, nteDataTablePluginRegistry } from './plugin-registry';

const createControl = (document: Document, className: string, label: string, content: string): HTMLButtonElement => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `nte-data-table-plugin-control ${className}`;
  button.setAttribute('aria-label', label);
  button.textContent = content;
  return button;
};

abstract class TablePlugin implements NteDataTablePlugin {
  protected context: NteDataTablePluginContext | null = null;
  public connect(context: NteDataTablePluginContext): void { this.context = context; this.onConnect(); }
  public disconnect(): void { this.onDisconnect(); this.context = null; }
  public refresh(): void { this.onRefresh(); }
  protected abstract onConnect(): void;
  protected abstract onDisconnect(): void;
  protected abstract onRefresh(): void;
}

export class NteDataTableSortPlugin extends TablePlugin {
  private readonly _collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  protected onConnect(): void {
    this.context?.table.tHead?.addEventListener('click', this._handleClick);
    this.onRefresh();
  }

  protected onDisconnect(): void {
    this.context?.table.tHead?.removeEventListener('click', this._handleClick);
    this.context?.table.querySelectorAll('[data-nte-data-table-sort-control]').forEach((control) => control.remove());
    this.context?.table.tHead?.querySelectorAll('[aria-sort]').forEach((header) => header.removeAttribute('aria-sort'));
  }

  protected onRefresh(): void {
    const context = this.context;
    Array.from(context?.table.tHead?.rows[0]?.cells ?? []).forEach((header, columnIndex) => {
      if (header.dataset['sortable'] === 'false' || header.querySelector('[data-nte-data-table-sort-control]')) return;
      const control = createControl(context!.host.ownerDocument, 'nte-data-table-sort-control indicator', `Spalte ${columnIndex + 1} sortieren`, '↕');
      control.dataset['nteDataTableSortControl'] = '';
      header.append(control);
    });
  }

  private _handleClick = (event: Event): void => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const control = target.closest<HTMLElement>('[data-nte-data-table-sort-control]');
    const header = control?.closest<HTMLTableCellElement>('th, td');
    const context = this.context;
    if (!control || !header || !context) return;
    const headers = Array.from(context.table.tHead?.rows[0]?.cells ?? []);
    const columnIndex = headers.indexOf(header);
    if (columnIndex < 0) return;
    const direction = header.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
    headers.forEach((cell) => {
      cell.removeAttribute('aria-sort');
      const indicator = cell.querySelector<HTMLElement>('[data-nte-data-table-sort-control]');
      if (indicator) indicator.textContent = '↕';
    });
    header.setAttribute('aria-sort', direction);
    control.textContent = direction === 'ascending' ? '↑' : '↓';
    const body = context.table.tBodies[0];
    const rows = Array.from(body?.rows ?? []);
    const multiplier = direction === 'ascending' ? 1 : -1;
    const type = header.dataset['sortType'] ?? 'string';
    rows.sort((left, right) => multiplier * this._compare(left.cells[columnIndex], right.cells[columnIndex], type));
    body?.append(...rows);
    context.host.dispatchEvent(new CustomEvent('nte-data-table-sort', {
      bubbles: true, composed: true, detail: { columnIndex, direction, header },
    }));
    context.refresh();
  };

  private _compare(left: HTMLTableCellElement, right: HTMLTableCellElement, type: string): number {
    const leftValue = left.dataset['sortValue'] ?? left.textContent?.trim() ?? '';
    const rightValue = right.dataset['sortValue'] ?? right.textContent?.trim() ?? '';
    if (type === 'number') return (Number(leftValue) || 0) - (Number(rightValue) || 0);
    if (type === 'date') return (Date.parse(leftValue) || 0) - (Date.parse(rightValue) || 0);
    return this._collator.compare(leftValue, rightValue);
  }
}

export class NteDataTableColumnReorderPlugin extends TablePlugin {
  private _sourceIndex: number | null = null;

  protected onConnect(): void {
    const head = this.context?.table.tHead;
    head?.addEventListener('dragstart', this._handleDragStart);
    head?.addEventListener('dragover', this._handleDragOver);
    head?.addEventListener('drop', this._handleDrop);
    head?.addEventListener('dragend', this._handleDragEnd);
    this.onRefresh();
  }

  protected onDisconnect(): void {
    const head = this.context?.table.tHead;
    head?.removeEventListener('dragstart', this._handleDragStart);
    head?.removeEventListener('dragover', this._handleDragOver);
    head?.removeEventListener('drop', this._handleDrop);
    head?.removeEventListener('dragend', this._handleDragEnd);
    this.context?.table.querySelectorAll('[data-nte-data-table-column-handle]').forEach((handle) => handle.remove());
    this._handleDragEnd();
  }

  protected onRefresh(): void {
    const context = this.context;
    Array.from(context?.table.tHead?.rows[0]?.cells ?? []).forEach((header, columnIndex) => {
      if (header.dataset['reorderable'] === 'false' || header.querySelector('[data-nte-data-table-column-handle]')) return;
      const handle = createControl(context!.host.ownerDocument, 'nte-data-table-drag-handle', `Spalte ${columnIndex + 1} verschieben`, '⋮⋮');
      handle.dataset['nteDataTableColumnHandle'] = '';
      handle.draggable = true;
      header.prepend(handle);
    });
  }

  private _handleDragStart = (event: DragEvent): void => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('[data-nte-data-table-column-handle]')) return;
    const header = target.closest<HTMLTableCellElement>('th, td');
    this._sourceIndex = Array.from(this.context?.table.tHead?.rows[0]?.cells ?? []).indexOf(header!);
    if (this._sourceIndex < 0) return;
    event.dataTransfer?.setData('text/plain', String(this._sourceIndex));
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    header?.setAttribute('data-nte-data-table-dragging', '');
  };

  private _handleDragOver = (event: DragEvent): void => {
    if (this._sourceIndex === null) return;
    const header = event.target instanceof Element ? event.target.closest<HTMLTableCellElement>('th, td') : null;
    if (!header) return;
    event.preventDefault();
    this._clearDropTargets();
    header.setAttribute('data-nte-data-table-drop-target', '');
  };

  private _handleDrop = (event: DragEvent): void => {
    const context = this.context;
    const target = event.target instanceof Element ? event.target.closest<HTMLTableCellElement>('th, td') : null;
    if (!context || this._sourceIndex === null || !target) return;
    event.preventDefault();
    const targetIndex = Array.from(context.table.tHead?.rows[0]?.cells ?? []).indexOf(target);
    if (targetIndex < 0 || targetIndex === this._sourceIndex) { this._handleDragEnd(); return; }
    for (const row of Array.from(context.table.rows)) {
      const sourceCell = row.cells[this._sourceIndex];
      const targetCell = row.cells[targetIndex];
      row.insertBefore(sourceCell, this._sourceIndex < targetIndex ? targetCell.nextSibling : targetCell);
    }
    context.remote.clearSelection();
    context.host.dispatchEvent(new CustomEvent('nte-data-table-column-reorder', {
      bubbles: true, composed: true, detail: { from: this._sourceIndex, to: targetIndex },
    }));
    this._handleDragEnd();
    context.refresh();
  };

  private _handleDragEnd = (): void => {
    this._sourceIndex = null;
    this.context?.table.querySelectorAll('[data-nte-data-table-dragging]').forEach((item) => item.removeAttribute('data-nte-data-table-dragging'));
    this._clearDropTargets();
  };

  private _clearDropTargets(): void {
    this.context?.table.querySelectorAll('[data-nte-data-table-drop-target]').forEach((item) => item.removeAttribute('data-nte-data-table-drop-target'));
  }
}

export class NteDataTableRowReorderPlugin extends TablePlugin {
  private _sourceRow: HTMLTableRowElement | null = null;

  protected onConnect(): void {
    const body = this.context?.table.tBodies[0];
    body?.addEventListener('dragstart', this._handleDragStart);
    body?.addEventListener('dragover', this._handleDragOver);
    body?.addEventListener('drop', this._handleDrop);
    body?.addEventListener('dragend', this._handleDragEnd);
    this.onRefresh();
  }

  protected onDisconnect(): void {
    const body = this.context?.table.tBodies[0];
    body?.removeEventListener('dragstart', this._handleDragStart);
    body?.removeEventListener('dragover', this._handleDragOver);
    body?.removeEventListener('drop', this._handleDrop);
    body?.removeEventListener('dragend', this._handleDragEnd);
    body?.querySelectorAll('[data-nte-data-table-row-handle]').forEach((handle) => handle.remove());
    this._handleDragEnd();
  }

  protected onRefresh(): void {
    const context = this.context;
    Array.from(context?.table.tBodies[0]?.rows ?? []).forEach((row, rowIndex) => {
      const firstCell = row.cells[0];
      if (!firstCell || row.dataset['reorderable'] === 'false' || firstCell.querySelector('[data-nte-data-table-row-handle]')) return;
      const handle = createControl(context!.host.ownerDocument, 'nte-data-table-drag-handle', `Zeile ${rowIndex + 1} verschieben`, '⠿');
      handle.dataset['nteDataTableRowHandle'] = '';
      handle.draggable = true;
      firstCell.prepend(handle);
    });
  }

  private _handleDragStart = (event: DragEvent): void => {
    const target = event.target;
    if (!(target instanceof Element) || !target.closest('[data-nte-data-table-row-handle]')) return;
    this._sourceRow = target.closest<HTMLTableRowElement>('tr');
    if (!this._sourceRow) return;
    event.dataTransfer?.setData('text/plain', this._sourceRow.id);
    if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    this._sourceRow.setAttribute('data-nte-data-table-dragging', '');
  };

  private _handleDragOver = (event: DragEvent): void => {
    if (!this._sourceRow) return;
    const row = event.target instanceof Element ? event.target.closest<HTMLTableRowElement>('tr') : null;
    if (!row || row === this._sourceRow) return;
    event.preventDefault();
    this._clearDropTargets();
    row.setAttribute('data-nte-data-table-drop-target', '');
  };

  private _handleDrop = (event: DragEvent): void => {
    const context = this.context;
    const targetRow = event.target instanceof Element ? event.target.closest<HTMLTableRowElement>('tr') : null;
    if (!context || !this._sourceRow || !targetRow || targetRow === this._sourceRow) return;
    event.preventDefault();
    const rows = Array.from(context.table.tBodies[0]?.rows ?? []);
    const from = rows.indexOf(this._sourceRow);
    const to = rows.indexOf(targetRow);
    const after = event.clientY > targetRow.getBoundingClientRect().top + targetRow.offsetHeight / 2;
    targetRow.parentElement?.insertBefore(this._sourceRow, after ? targetRow.nextSibling : targetRow);
    context.host.dispatchEvent(new CustomEvent('nte-data-table-row-reorder', {
      bubbles: true, composed: true, detail: { from, to },
    }));
    this._handleDragEnd();
    context.refresh();
  };

  private _handleDragEnd = (): void => {
    this._sourceRow = null;
    this.context?.table.querySelectorAll('[data-nte-data-table-dragging]').forEach((item) => item.removeAttribute('data-nte-data-table-dragging'));
    this._clearDropTargets();
  };

  private _clearDropTargets(): void {
    this.context?.table.querySelectorAll('[data-nte-data-table-drop-target]').forEach((item) => item.removeAttribute('data-nte-data-table-drop-target'));
  }
}

nteDataTablePluginRegistry.register('sort', () => new NteDataTableSortPlugin());
nteDataTablePluginRegistry.register('reorder-columns', () => new NteDataTableColumnReorderPlugin());
nteDataTablePluginRegistry.register('reorder-rows', () => new NteDataTableRowReorderPlugin());
