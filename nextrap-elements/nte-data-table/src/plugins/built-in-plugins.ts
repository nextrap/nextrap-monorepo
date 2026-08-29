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

const REORDER_ANIMATION_MS = 160;
const AUTO_SCROLL_EDGE = 36;
const AUTO_SCROLL_STEP = 14;

const copyComputedStyle = (source: Element, target: HTMLElement): void => {
  const style = source.ownerDocument.defaultView?.getComputedStyle(source);
  if (!style) return;
  for (let index = 0; index < style.length; index += 1) {
    const property = style.item(index);
    target.style.setProperty(property, style.getPropertyValue(property), style.getPropertyPriority(property));
  }
  target.style.position = 'absolute';
  target.style.inset = 'auto';
  target.style.margin = '0';
  target.style.transform = 'none';
  target.style.visibility = 'visible';
};

const createPreview = (document: Document): HTMLDivElement => {
  const preview = document.createElement('div');
  preview.dataset['nteDataTableDragPreview'] = '';
  preview.setAttribute('aria-hidden', 'true');
  Object.assign(preview.style, {
    position: 'fixed',
    zIndex: '2147483647',
    pointerEvents: 'none',
    opacity: '0.94',
    filter: 'drop-shadow(0 0.5rem 1rem rgb(0 0 0 / 0.22))',
    willChange: 'left, top',
  });
  document.body.append(preview);
  return preview;
};

const animateMove = (elements: HTMLElement[], mutate: () => void, axis: 'x' | 'y'): void => {
  if (elements[0]?.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    mutate();
    return;
  }
  const before = new Map<HTMLElement, DOMRect>(
    elements.map((element) => [element, element.getBoundingClientRect()] as const),
  );
  mutate();
  for (const element of elements) {
    const previous = before.get(element);
    const current = element.getBoundingClientRect();
    const delta = axis === 'x' ? previous!.left - current.left : previous!.top - current.top;
    if (!delta) continue;
    element.animate(
      [
        { transform: axis === 'x' ? `translateX(${delta}px)` : `translateY(${delta}px)` },
        { transform: 'translate(0, 0)' },
      ],
      { duration: REORDER_ANIMATION_MS, easing: 'cubic-bezier(.2,.8,.2,1)' },
    );
  }
};

const autoScroll = (body: HTMLTableSectionElement, event: PointerEvent, axis: 'x' | 'y'): void => {
  const rect = body.getBoundingClientRect();
  if (axis === 'y') {
    if (event.clientY < rect.top + AUTO_SCROLL_EDGE) body.scrollTop -= AUTO_SCROLL_STEP;
    if (event.clientY > rect.bottom - AUTO_SCROLL_EDGE) body.scrollTop += AUTO_SCROLL_STEP;
  } else {
    if (event.clientX < rect.left + AUTO_SCROLL_EDGE) body.scrollLeft -= AUTO_SCROLL_STEP;
    if (event.clientX > rect.right - AUTO_SCROLL_EDGE) body.scrollLeft += AUTO_SCROLL_STEP;
  }
};

abstract class PointerReorderPlugin extends TablePlugin {
  protected pointerId: number | null = null;
  protected preview: HTMLDivElement | null = null;
  protected grabOffsetX = 0;
  protected grabOffsetY = 0;

  protected bindPointerTracking(): void {
    const document = this.context?.host.ownerDocument;
    document?.addEventListener('pointermove', this.handlePointerMove);
    document?.addEventListener('pointerup', this.handlePointerEnd);
    document?.addEventListener('pointercancel', this.handlePointerCancel);
  }

  protected unbindPointerTracking(): void {
    const document = this.context?.host.ownerDocument;
    document?.removeEventListener('pointermove', this.handlePointerMove);
    document?.removeEventListener('pointerup', this.handlePointerEnd);
    document?.removeEventListener('pointercancel', this.handlePointerCancel);
  }

  protected movePreview(clientX: number, clientY: number, axis: 'x' | 'y' | 'both'): void {
    if (!this.preview) return;
    if (axis !== 'y') this.preview.style.left = `${clientX - this.grabOffsetX}px`;
    if (axis !== 'x') this.preview.style.top = `${clientY - this.grabOffsetY}px`;
  }

  protected clearDragState(): void {
    this.unbindPointerTracking();
    this.preview?.remove();
    this.preview = null;
    this.pointerId = null;
    this.context?.table.querySelectorAll('[data-nte-data-table-dragging]').forEach((item) => item.removeAttribute('data-nte-data-table-dragging'));
    this.context?.table.querySelectorAll('[data-nte-data-table-drop-target]').forEach((item) => item.removeAttribute('data-nte-data-table-drop-target'));
  }

  protected abstract handlePointerMove(event: PointerEvent): void;
  protected abstract handlePointerEnd(event: PointerEvent): void;
  protected abstract handlePointerCancel(event: PointerEvent): void;
}

export class NteDataTableColumnReorderPlugin extends PointerReorderPlugin {
  private _sourceIndex: number | null = null;
  private _originalCells: HTMLTableCellElement[][] = [];

  protected onConnect(): void {
    this.context?.table.tHead?.addEventListener('pointerdown', this._handlePointerDown);
    this.onRefresh();
  }

  protected onDisconnect(): void {
    this.context?.table.tHead?.removeEventListener('pointerdown', this._handlePointerDown);
    this.context?.table.querySelectorAll('[data-nte-data-table-column-handle]').forEach((handle) => handle.remove());
    this._cancelDrag();
  }

  protected onRefresh(): void {
    const context = this.context;
    Array.from(context?.table.tHead?.rows[0]?.cells ?? []).forEach((header, columnIndex) => {
      if (header.dataset['reorderable'] === 'false' || header.querySelector('[data-nte-data-table-column-handle]')) return;
      const handle = createControl(context!.host.ownerDocument, 'nte-data-table-drag-handle', `Spalte ${columnIndex + 1} verschieben`, '⋮⋮');
      handle.dataset['nteDataTableColumnHandle'] = '';
      header.prepend(handle);
    });
  }

  private _handlePointerDown = (event: PointerEvent): void => {
    const handle = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-nte-data-table-column-handle]') : null;
    const context = this.context;
    if (!handle || !context || event.button !== 0 || this.pointerId !== null) return;
    const header = handle.closest<HTMLTableCellElement>('th, td');
    const headers = Array.from(context.table.tHead?.rows[0]?.cells ?? []);
    const sourceIndex = headers.indexOf(header!);
    if (!header || sourceIndex < 0) return;
    event.preventDefault();
    this.pointerId = event.pointerId;
    this._sourceIndex = sourceIndex;
    this._originalCells = Array.from(context.table.rows, (row) => Array.from(row.cells));
    this.preview = this._createColumnPreview(sourceIndex);
    const rect = header.getBoundingClientRect();
    this.grabOffsetX = event.clientX - rect.left;
    this.grabOffsetY = 0;
    this.movePreview(event.clientX, rect.top, 'x');
    for (const row of Array.from(context.table.rows)) row.cells[sourceIndex]?.setAttribute('data-nte-data-table-dragging', '');
    this.bindPointerTracking();
  };

  protected handlePointerMove = (event: PointerEvent): void => {
    const context = this.context;
    if (!context || event.pointerId !== this.pointerId || this._sourceIndex === null) return;
    event.preventDefault();
    this.movePreview(event.clientX, event.clientY, 'x');
    autoScroll(context.table.tBodies[0], event, 'x');
    const headers = Array.from(context.table.tHead?.rows[0]?.cells ?? []);
    const target = headers.find((header) => event.clientX < header.getBoundingClientRect().left + header.getBoundingClientRect().width / 2) ?? headers[headers.length - 1];
    const targetIndex = target ? headers.indexOf(target) : -1;
    if (targetIndex < 0 || targetIndex === this._sourceIndex) return;
    const cells = Array.from(context.table.rows).flatMap((row) => Array.from(row.cells));
    const sourceIndex = this._sourceIndex;
    animateMove(cells, () => {
      for (const row of Array.from(context.table.rows)) {
        const sourceCell = row.cells[sourceIndex];
        const targetCell = row.cells[targetIndex];
        row.insertBefore(sourceCell, sourceIndex < targetIndex ? targetCell.nextSibling : targetCell);
      }
    }, 'x');
    this._sourceIndex = targetIndex;
    context.table.querySelectorAll('[data-nte-data-table-drop-target]').forEach((item) => item.removeAttribute('data-nte-data-table-drop-target'));
    target.setAttribute('data-nte-data-table-drop-target', '');
  };

  protected handlePointerEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;
    const context = this.context;
    const sourceHeader = this._originalCells[0]?.find((cell) => cell.hasAttribute('data-nte-data-table-dragging'));
    const originalIndex = sourceHeader ? this._originalCells[0].indexOf(sourceHeader) : -1;
    const to = sourceHeader ? Array.from(context?.table.tHead?.rows[0]?.cells ?? []).indexOf(sourceHeader) : -1;
    this._finishDrag();
    if (!context || originalIndex < 0 || to < 0 || originalIndex === to) return;
    context.remote.clearSelection();
    context.host.dispatchEvent(new CustomEvent('nte-data-table-column-reorder', {
      bubbles: true, composed: true, detail: { from: originalIndex, to },
    }));
    context.refresh();
  };

  protected handlePointerCancel = (event: PointerEvent): void => {
    if (event.pointerId === this.pointerId) this._cancelDrag();
  };

  private _createColumnPreview(columnIndex: number): HTMLDivElement {
    const context = this.context!;
    const preview = createPreview(context.host.ownerDocument);
    const bodyRect = context.table.tBodies[0].getBoundingClientRect();
    const cells = Array.from(context.table.rows, (row) => row.cells[columnIndex]).filter((cell) => {
      if (!cell || cell.ownerDocument.defaultView?.getComputedStyle(cell).display === 'none') return false;
      const rect = cell.getBoundingClientRect();
      return cell.parentElement?.parentElement?.tagName !== 'TBODY' || (rect.bottom >= bodyRect.top && rect.top <= bodyRect.bottom);
    });
    const rects = cells.map((cell) => cell.getBoundingClientRect());
    const top = Math.min(...rects.map((rect) => rect.top));
    const bottom = Math.max(...rects.map((rect) => rect.bottom));
    const width = rects[0]?.width ?? 0;
    Object.assign(preview.style, { top: `${top}px`, left: `${rects[0]?.left ?? 0}px`, width: `${width}px`, height: `${bottom - top}px` });
    cells.forEach((cell, index) => {
      const clone = cell.cloneNode(true) as HTMLElement;
      copyComputedStyle(cell, clone);
      Object.assign(clone.style, { top: `${rects[index].top - top}px`, left: '0', width: `${width}px`, height: `${rects[index].height}px` });
      preview.append(clone);
    });
    return preview;
  }

  private _finishDrag(): void {
    this.clearDragState();
    this._sourceIndex = null;
    this._originalCells = [];
  }

  private _cancelDrag(): void {
    const context = this.context;
    if (context && this._originalCells.length) {
      animateMove(Array.from(context.table.rows).flatMap((row) => Array.from(row.cells)), () => {
        Array.from(context.table.rows).forEach((row, rowIndex) => row.append(...this._originalCells[rowIndex]));
      }, 'x');
    }
    this._finishDrag();
  }
}

export class NteDataTableRowReorderPlugin extends PointerReorderPlugin {
  private _sourceRow: HTMLTableRowElement | null = null;
  private _originalRows: HTMLTableRowElement[] = [];

  protected onConnect(): void {
    this.context?.table.tBodies[0]?.addEventListener('pointerdown', this._handlePointerDown);
    this.onRefresh();
  }

  protected onDisconnect(): void {
    const body = this.context?.table.tBodies[0];
    body?.removeEventListener('pointerdown', this._handlePointerDown);
    body?.querySelectorAll('[data-nte-data-table-row-handle]').forEach((handle) => handle.remove());
    this._cancelDrag();
  }

  protected onRefresh(): void {
    const context = this.context;
    Array.from(context?.table.tBodies[0]?.rows ?? []).forEach((row, rowIndex) => {
      const firstCell = row.cells[0];
      if (!firstCell || row.dataset['reorderable'] === 'false' || firstCell.querySelector('[data-nte-data-table-row-handle]')) return;
      const handle = createControl(context!.host.ownerDocument, 'nte-data-table-drag-handle', `Zeile ${rowIndex + 1} verschieben`, '⠿');
      handle.dataset['nteDataTableRowHandle'] = '';
      firstCell.prepend(handle);
    });
  }

  private _handlePointerDown = (event: PointerEvent): void => {
    const handle = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-nte-data-table-row-handle]') : null;
    const context = this.context;
    if (!handle || !context || event.button !== 0 || this.pointerId !== null) return;
    const row = handle.closest<HTMLTableRowElement>('tr');
    if (!row) return;
    event.preventDefault();
    const rect = row.getBoundingClientRect();
    this.pointerId = event.pointerId;
    this._sourceRow = row;
    this._originalRows = Array.from(context.table.tBodies[0].rows);
    this.preview = this._createRowPreview(row);
    this.grabOffsetX = event.clientX - rect.left;
    this.grabOffsetY = event.clientY - rect.top;
    this.movePreview(event.clientX, event.clientY, 'both');
    row.setAttribute('data-nte-data-table-dragging', '');
    this.bindPointerTracking();
  };

  protected handlePointerMove = (event: PointerEvent): void => {
    const context = this.context;
    if (!context || !this._sourceRow || event.pointerId !== this.pointerId) return;
    event.preventDefault();
    this.movePreview(event.clientX, event.clientY, 'both');
    const body = context.table.tBodies[0];
    autoScroll(body, event, 'y');
    const rows = Array.from(body.rows).filter((row) => row !== this._sourceRow);
    const target = rows.find((row) => event.clientY < row.getBoundingClientRect().top + row.getBoundingClientRect().height / 2) ?? rows[rows.length - 1];
    if (!target) return;
    const after = event.clientY >= target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2;
    const nextSibling = after ? target.nextSibling : target;
    if (nextSibling === this._sourceRow || (!after && target.previousSibling === this._sourceRow)) return;
    animateMove(Array.from(body.rows), () => body.insertBefore(this._sourceRow!, nextSibling), 'y');
    body.querySelectorAll('[data-nte-data-table-drop-target]').forEach((item) => item.removeAttribute('data-nte-data-table-drop-target'));
    target.setAttribute('data-nte-data-table-drop-target', '');
  };

  protected handlePointerEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.pointerId) return;
    const context = this.context;
    const source = this._sourceRow;
    const from = source ? this._originalRows.indexOf(source) : -1;
    const to = source ? Array.from(context?.table.tBodies[0]?.rows ?? []).indexOf(source) : -1;
    this._finishDrag();
    if (!context || from < 0 || to < 0 || from === to) return;
    context.host.dispatchEvent(new CustomEvent('nte-data-table-row-reorder', {
      bubbles: true, composed: true, detail: { from, to },
    }));
    context.refresh();
  };

  protected handlePointerCancel = (event: PointerEvent): void => {
    if (event.pointerId === this.pointerId) this._cancelDrag();
  };

  private _createRowPreview(row: HTMLTableRowElement): HTMLDivElement {
    const preview = createPreview(row.ownerDocument);
    const rect = row.getBoundingClientRect();
    Object.assign(preview.style, { display: 'flex', top: `${rect.top}px`, left: `${rect.left}px`, width: `${rect.width}px`, height: `${rect.height}px` });
    for (const cell of Array.from(row.cells)) {
      if (cell.ownerDocument.defaultView?.getComputedStyle(cell).display === 'none') continue;
      const clone = cell.cloneNode(true) as HTMLElement;
      const cellRect = cell.getBoundingClientRect();
      copyComputedStyle(cell, clone);
      Object.assign(clone.style, { position: 'relative', flex: `0 0 ${cellRect.width}px`, width: `${cellRect.width}px`, height: `${cellRect.height}px` });
      preview.append(clone);
    }
    return preview;
  }

  private _finishDrag(): void {
    this.clearDragState();
    this._sourceRow = null;
    this._originalRows = [];
  }

  private _cancelDrag(): void {
    const body = this.context?.table.tBodies[0];
    if (body && this._originalRows.length) animateMove(Array.from(body.rows), () => body.append(...this._originalRows), 'y');
    this._finishDrag();
  }
}

nteDataTablePluginRegistry.register('sort', () => new NteDataTableSortPlugin());
nteDataTablePluginRegistry.register('reorder-columns', () => new NteDataTableColumnReorderPlugin());
nteDataTablePluginRegistry.register('reorder-rows', () => new NteDataTableRowReorderPlugin());
