import { nextrap_element } from '@nextrap/nt-core';
import { resetStyle } from '@nextrap/style-reset';
import { html, type PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import style from './nte-data-table.scss?inline';

const DEFAULT_HEIGHT = '24rem';
const COLUMN_RESIZE_HIT_AREA = 8;
const MIN_COLUMN_WIDTH = 48;
const OWNED_ATTRIBUTES = {
  hidden: 'data-nte-data-table-hidden',
  pinned: 'data-nte-data-table-pinned',
  sized: 'data-nte-data-table-sized',
} as const;

interface SavedStyle {
  priority: string;
  value: string;
}

interface ManagedState {
  attributes: Map<string, string | null>;
  styles: Map<string, SavedStyle>;
}

interface ColumnResizeState {
  direction: 1 | -1;
  headerCell: HTMLTableCellElement;
  pointerId: number;
  startClientX: number;
  startWidth: number;
}

@customElement('nte-data-table')
export class NteDataTableElement extends nextrap_element({
  eventBinding: false,
  slotVisibility: false,
}) {
  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  @property({ type: String }) public accessor height = DEFAULT_HEIGHT;
  @property({ type: Number, attribute: 'pinned-columns' }) public accessor pinnedColumns = 0;
  @property({ type: String, attribute: 'scroll-label' }) public accessor scrollLabel = '';
  @property({ type: String, reflect: true, attribute: 'aria-label' }) public override accessor ariaLabel = '';

  private _layoutFrame: number | null = null;
  private _managed = new Map<HTMLElement, ManagedState>();
  private _mutationObserver: MutationObserver | null = null;
  private _columnResize: ColumnResizeState | null = null;
  private _resizeObserver: ResizeObserver | null = null;
  private _resizeCursorCell: HTMLTableCellElement | null = null;
  private _resizeCursorStyle: SavedStyle | null = null;
  private _resizableHeaders = new Set<HTMLTableCellElement>();
  private _resizeTargets = new Set<Element>();
  private _sourceTable: HTMLTableElement | null = null;
  private _suppressedClickCell: HTMLTableCellElement | null = null;
  private _suppressedClickTimer: number | null = null;
  private _warnings = new Set<string>();

  public get sourceTable(): HTMLTableElement | null {
    return this._sourceTable;
  }

  public refresh(): void {
    this._scheduleLayout();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.hasUpdated) queueMicrotask(() => this.isConnected && this._bindSourceTable());
  }

  override disconnectedCallback(): void {
    this._unbindSourceTable();
    super.disconnectedCallback();
  }

  public override firstUpdated(): void {
    this._bindSourceTable();
  }

  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);
    if (changedProperties.has('height')) this._validateHeight();
    if (
      changedProperties.has('ariaLabel') ||
      changedProperties.has('pinnedColumns') ||
      changedProperties.has('scrollLabel')
    ) {
      this._scheduleLayout();
    }
  }

  protected override render() {
    return html`
      <div
        id="viewport"
        part="viewport"
        role="region"
        tabindex="0"
        aria-label="${this._viewportLabel()}"
        style="block-size: ${this._safeHeight()};"
      >
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  private _handleSlotChange = (): void => {
    this._bindSourceTable();
  };

  private _bindSourceTable(): void {
    const tables = Array.from(this.children).filter(
      (element): element is HTMLTableElement => element.tagName === 'TABLE',
    );
    const sourceTable = tables.length === 1 ? tables[0] : null;

    if (sourceTable === this._sourceTable) {
      this._scheduleLayout();
      return;
    }

    this._unbindSourceTable();
    this._sourceTable = sourceTable;

    if (!sourceTable) {
      this._warnOnce(
        tables.length === 0
          ? 'nte-data-table expects exactly one direct <table> child.'
          : 'nte-data-table received more than one direct <table>; layout enhancements are disabled.',
      );
      return;
    }

    sourceTable.addEventListener('pointerdown', this._handleTablePointerDown, true);
    sourceTable.addEventListener('pointermove', this._handleTablePointerMove, true);
    sourceTable.addEventListener('pointerup', this._handleTablePointerEnd, true);
    sourceTable.addEventListener('pointercancel', this._handleTablePointerEnd, true);
    sourceTable.addEventListener('lostpointercapture', this._handleLostPointerCapture, true);
    sourceTable.addEventListener('pointerleave', this._handleTablePointerLeave, true);
    sourceTable.addEventListener('click', this._handleTableClick, true);

    const view = this.ownerDocument.defaultView;
    if (view?.MutationObserver) {
      this._mutationObserver = new view.MutationObserver(this._handleMutations);
      this._observeSourceTable();
    }
    if (view?.ResizeObserver) {
      this._resizeObserver = new view.ResizeObserver(() => this._scheduleLayout());
    }

    this._scheduleLayout();
  }

  private _unbindSourceTable(): void {
    this._sourceTable?.removeEventListener('pointerdown', this._handleTablePointerDown, true);
    this._sourceTable?.removeEventListener('pointermove', this._handleTablePointerMove, true);
    this._sourceTable?.removeEventListener('pointerup', this._handleTablePointerEnd, true);
    this._sourceTable?.removeEventListener('pointercancel', this._handleTablePointerEnd, true);
    this._sourceTable?.removeEventListener('lostpointercapture', this._handleLostPointerCapture, true);
    this._sourceTable?.removeEventListener('pointerleave', this._handleTablePointerLeave, true);
    this._sourceTable?.removeEventListener('click', this._handleTableClick, true);
    this._finishColumnResize(true, false);
    this._clearClickSuppression();
    this._setResizeCursor(null);
    this._mutationObserver?.disconnect();
    this._mutationObserver = null;
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._resizableHeaders.clear();
    this._resizeTargets.clear();
    this._cancelLayout();
    this._restoreManagedState();
    this._sourceTable = null;
  }

  private _handleTablePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || !event.isPrimary || this._columnResize) return;

    const table = this._sourceTable;
    if (!table) return;
    const headerCell = this._resizeCellAt(event);
    if (!headerCell) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const direction = this.ownerDocument.defaultView?.getComputedStyle(table).direction;
    this._columnResize = {
      direction: direction === 'rtl' ? -1 : 1,
      headerCell,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startWidth: headerCell.getBoundingClientRect().width,
    };
    this._setResizeCursor(headerCell);
    if (typeof headerCell.setPointerCapture !== 'function') {
      this._finishColumnResize(false, false);
      return;
    }
    try {
      headerCell.setPointerCapture(event.pointerId);
    } catch {
      this._finishColumnResize(false, false);
    }
  };

  private _handleTablePointerMove = (event: PointerEvent): void => {
    const resize = this._columnResize;
    if (!resize) {
      this._setResizeCursor(this._resizeCellAt(event));
      return;
    }
    if (resize.pointerId !== event.pointerId) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const delta = (event.clientX - resize.startClientX) * resize.direction;
    const width = `${Math.max(MIN_COLUMN_WIDTH, Math.round(resize.startWidth + delta))}px`;
    if (resize.headerCell.dataset['width'] !== width) resize.headerCell.dataset['width'] = width;
  };

  private _handleTablePointerEnd = (event: PointerEvent): void => {
    if (this._columnResize?.pointerId !== event.pointerId) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    this._finishColumnResize();
  };

  private _handleLostPointerCapture = (event: PointerEvent): void => {
    if (this._columnResize?.pointerId === event.pointerId) this._finishColumnResize(false);
  };

  private _handleTablePointerLeave = (): void => {
    const resize = this._columnResize;
    if (!resize) {
      this._setResizeCursor(null);
      return;
    }
    if (!resize.headerCell.hasPointerCapture?.(resize.pointerId)) this._finishColumnResize(false);
  };

  private _handleTableClick = (event: MouseEvent): void => {
    const target = event.target;
    if (!this._suppressedClickCell || !(target instanceof Node) || !this._suppressedClickCell.contains(target)) {
      return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
    this._clearClickSuppression();
  };

  private _resizeCellAt(event: PointerEvent): HTMLTableCellElement | null {
    const target = event.target;
    if (!(target instanceof Element)) return null;

    const table = this._sourceTable;
    const headerCell = target.closest<HTMLTableCellElement>('th, td');
    const headerRow = table?.tHead?.rows[0];
    if (
      !headerCell ||
      !headerRow ||
      headerCell.parentElement !== headerRow ||
      !this._resizableHeaders.has(headerCell) ||
      headerCell.hidden ||
      this._isDataHidden(headerCell)
    ) {
      return null;
    }

    const bounds = headerCell.getBoundingClientRect();
    const direction = table ? this.ownerDocument.defaultView?.getComputedStyle(table).direction : 'ltr';
    const distance = direction === 'rtl' ? event.clientX - bounds.left : bounds.right - event.clientX;
    return distance >= 0 && distance <= COLUMN_RESIZE_HIT_AREA ? headerCell : null;
  }

  private _finishColumnResize(releaseCapture = true, suppressClick = true): void {
    const resize = this._columnResize;
    if (!resize) return;

    this._columnResize = null;
    try {
      if (releaseCapture && resize.headerCell.hasPointerCapture?.(resize.pointerId)) {
        resize.headerCell.releasePointerCapture?.(resize.pointerId);
      }
    } catch {
      // The browser may have released capture already after pointercancel or DOM removal.
    }
    if (suppressClick) this._suppressNextClick(resize.headerCell);
    this._setResizeCursor(null);
    this._scheduleLayout();
  }

  private _suppressNextClick(headerCell: HTMLTableCellElement): void {
    this._clearClickSuppression();
    const view = this.ownerDocument.defaultView;
    if (!view) return;

    this._suppressedClickCell = headerCell;
    this._suppressedClickTimer = view.setTimeout(() => this._clearClickSuppression(), 0);
  }

  private _clearClickSuppression(): void {
    if (this._suppressedClickTimer !== null) {
      this.ownerDocument.defaultView?.clearTimeout(this._suppressedClickTimer);
    }
    this._suppressedClickCell = null;
    this._suppressedClickTimer = null;
  }

  private _setResizeCursor(headerCell: HTMLTableCellElement | null): void {
    if (headerCell === this._resizeCursorCell) return;

    if (this._resizeCursorCell && this._resizeCursorStyle) {
      const { priority, value } = this._resizeCursorStyle;
      if (value) this._resizeCursorCell.style.setProperty('cursor', value, priority);
      else this._resizeCursorCell.style.removeProperty('cursor');
    }

    this._resizeCursorCell = headerCell;
    this._resizeCursorStyle = headerCell
      ? {
          priority: headerCell.style.getPropertyPriority('cursor'),
          value: headerCell.style.getPropertyValue('cursor'),
        }
      : null;
    headerCell?.style.setProperty('cursor', 'col-resize');
  }

  private _observeSourceTable(): void {
    if (!this._sourceTable || !this._mutationObserver) return;
    this._mutationObserver.observe(this._sourceTable, {
      attributeFilter: ['aria-label', 'colspan', 'data-hidden', 'data-width', 'hidden', 'rowspan', 'style', 'width'],
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  private _handleMutations = (records: MutationRecord[]): void => {
    const resize = this._columnResize;
    if (resize && resize.headerCell.parentElement !== this._sourceTable?.tHead?.rows[0]) {
      this._finishColumnResize(true, false);
    }
    if (records.some((record) => this._mutationAffectsLayout(record))) this._scheduleLayout();
  };

  private _mutationAffectsLayout(record: MutationRecord): boolean {
    const table = this._sourceTable;
    if (!table) return false;

    if (record.type === 'characterData') {
      return Boolean(table.caption?.contains(record.target.parentNode));
    }

    if (!(record.target instanceof Element)) return false;
    const target = record.target;
    const ownerTable = target.tagName === 'TABLE' ? target : target.closest('table');
    if (ownerTable !== table) return false;

    if (record.type === 'childList') {
      return (
        ['TABLE', 'THEAD', 'TBODY', 'TFOOT', 'TR', 'CAPTION'].includes(target.tagName) ||
        Boolean(table.tHead?.contains(target))
      );
    }

    if (record.attributeName === 'aria-label') return target === table;
    if (target.tagName === 'TABLE') return record.attributeName === 'style';
    if (!['TH', 'TD'].includes(target.tagName)) return false;

    const isSpanMutation = record.attributeName === 'colspan' || record.attributeName === 'rowspan';
    return isSpanMutation || Boolean(table.tHead?.contains(target));
  }

  private _scheduleLayout(): void {
    if (!this.isConnected || !this._sourceTable || this._layoutFrame !== null) return;
    const view = this.ownerDocument.defaultView;
    if (!view) return;
    this._layoutFrame = view.requestAnimationFrame(() => {
      this._layoutFrame = null;
      this._syncLayout();
    });
  }

  private _cancelLayout(): void {
    if (this._layoutFrame === null) return;
    this.ownerDocument.defaultView?.cancelAnimationFrame(this._layoutFrame);
    this._layoutFrame = null;
  }

  private _syncLayout(): void {
    const table = this._sourceTable;
    if (!table) return;

    this._mutationObserver?.disconnect();
    this._restoreManagedState();
    this._resizableHeaders.clear();
    let headerCells: HTMLTableCellElement[] = [];

    try {
      this._updateViewportLabel(table);
      this._setManagedStyle(table, 'border-collapse', 'separate');
      this._setManagedStyle(table, 'border-spacing', '0px');
      this._setManagedStyle(table, 'inline-size', 'max-content');
      this._setManagedStyle(table, 'table-layout', 'fixed');

      const headerRow = table.tHead?.rows[0];
      if (!headerRow || table.tHead?.rows.length !== 1 || (table.tFoot && table.tFoot.rows.length !== 1)) {
        this._finishColumnResize(true, false);
        this._warnOnce('nte-data-table layout enhancements require exactly one header row and at most one footer row.');
        return;
      }

      headerCells = Array.from(headerRow.cells);
      const footerCells = table.tFoot ? Array.from(table.tFoot.rows[0].cells) : [];
      const rows = Array.from(table.rows);

      for (const row of rows) {
        for (const cell of Array.from(row.cells)) {
          this._setManagedStyle(cell, 'box-sizing', 'border-box');
        }
      }

      for (const cell of headerCells) {
        this._setManagedStyle(cell, 'position', 'sticky');
        this._setManagedStyle(cell, 'inset-block-start', '0px');
        this._setManagedStyle(cell, 'z-index', '3');
      }

      for (const cell of footerCells) {
        this._setManagedStyle(cell, 'position', 'sticky');
        this._setManagedStyle(cell, 'inset-block-end', '0px');
        this._setManagedStyle(cell, 'z-index', '3');
      }

      const columnCount = headerRow.cells.length;
      const isRectangular =
        columnCount > 0 &&
        rows.every(
          (row) =>
            row.cells.length === columnCount &&
            Array.from(row.cells).every((cell) => cell.colSpan === 1 && cell.rowSpan === 1),
        );

      if (!isRectangular) {
        this._finishColumnResize(true, false);
        this._warnOnce('nte-data-table width, hide and pin enhancements do not support colspan or rowspan.');
        return;
      }

      const visibleColumns: number[] = [];

      headerCells.forEach((headerCell, columnIndex) => {
        const hidden = headerCell.hidden || this._isDataHidden(headerCell);
        const width = this._readColumnWidth(headerCell);

        for (const row of rows) {
          const cell = row.cells[columnIndex];
          if (hidden) {
            this._setManagedAttribute(cell, OWNED_ATTRIBUTES.hidden, '');
            this._setManagedStyle(cell, 'display', 'none');
          }
          if (width) {
            this._setManagedAttribute(cell, OWNED_ATTRIBUTES.sized, '');
            this._setManagedStyle(cell, 'inline-size', width);
            this._setManagedStyle(cell, 'min-inline-size', width);
            this._setManagedStyle(cell, 'max-inline-size', width);
          }
        }

        if (!hidden) visibleColumns.push(columnIndex);
      });

      for (const columnIndex of visibleColumns) {
        const headerCell = headerCells[columnIndex];
        if (headerCell) this._resizableHeaders.add(headerCell);
      }

      const pinnedCount = Math.min(this._safePinnedColumns(), visibleColumns.length);
      let pinOffset = 0;

      for (const columnIndex of visibleColumns.slice(0, pinnedCount)) {
        const measuredWidth = headerCells[columnIndex].getBoundingClientRect().width;
        for (const row of rows) {
          const cell = row.cells[columnIndex];
          this._setManagedAttribute(cell, OWNED_ATTRIBUTES.pinned, '');
          this._setManagedStyle(cell, 'position', 'sticky');
          this._setManagedStyle(cell, 'inset-inline-start', `${pinOffset}px`);
          this._setManagedStyle(cell, 'z-index', row.parentElement?.tagName === 'TBODY' ? '2' : '4');
        }
        pinOffset += measuredWidth;
      }
    } finally {
      this._updateResizeTargets(table, headerCells);
      this._observeSourceTable();
    }
  }

  private _updateResizeTargets(table: HTMLTableElement, headerCells: HTMLTableCellElement[]): void {
    if (!this._resizeObserver) return;

    const nextTargets = new Set<Element>([table, ...headerCells]);
    const viewport = this.shadowRoot?.querySelector<HTMLElement>('#viewport');
    if (viewport) nextTargets.add(viewport);

    for (const target of this._resizeTargets) {
      if (!nextTargets.has(target)) this._resizeObserver.unobserve(target);
    }
    for (const target of nextTargets) {
      if (!this._resizeTargets.has(target)) this._resizeObserver.observe(target);
    }

    this._resizeTargets = nextTargets;
  }

  private _readColumnWidth(headerCell: HTMLTableCellElement): string | null {
    let value =
      headerCell.dataset['width']?.trim() ||
      headerCell.style.width.trim() ||
      headerCell.getAttribute('width')?.trim();
    if (!value) return null;
    if (/^\d+(?:\.\d+)?$/.test(value)) value = `${value}px`;

    const css = this.ownerDocument.defaultView?.CSS;
    if (!css || css.supports('width', value)) return value;
    this._warnOnce(`nte-data-table ignored invalid column width: ${value}`);
    return null;
  }

  private _isDataHidden(headerCell: HTMLTableCellElement): boolean {
    if (!headerCell.hasAttribute('data-hidden')) return false;
    return headerCell.getAttribute('data-hidden') !== 'false';
  }

  private _safePinnedColumns(): number {
    if (!Number.isFinite(this.pinnedColumns)) return 0;
    return Math.max(0, Math.floor(this.pinnedColumns));
  }

  private _safeHeight(): string {
    const height = (this.height ?? '').trim();
    const css = this.ownerDocument.defaultView?.CSS;
    return height && (!css || css.supports('height', height)) ? height : DEFAULT_HEIGHT;
  }

  private _validateHeight(): void {
    if (this._safeHeight() !== DEFAULT_HEIGHT || (this.height ?? '').trim() === DEFAULT_HEIGHT) return;
    this._warnOnce(`nte-data-table ignored invalid height: ${this.height}`);
  }

  private _viewportLabel(): string {
    return (this.scrollLabel ?? '').trim() || (this.ariaLabel ?? '').trim() || 'Data table';
  }

  private _updateViewportLabel(table: HTMLTableElement): void {
    const caption = table.caption?.textContent?.trim();
    const label =
      (this.scrollLabel ?? '').trim() ||
      (this.ariaLabel ?? '').trim() ||
      table.getAttribute('aria-label')?.trim() ||
      caption ||
      this._viewportLabel();
    this.shadowRoot?.querySelector('#viewport')?.setAttribute('aria-label', label);
  }

  private _managedState(element: HTMLElement): ManagedState {
    let state = this._managed.get(element);
    if (!state) {
      state = { attributes: new Map(), styles: new Map() };
      this._managed.set(element, state);
    }
    return state;
  }

  private _setManagedAttribute(element: HTMLElement, name: string, value: string): void {
    const state = this._managedState(element);
    if (!state.attributes.has(name)) state.attributes.set(name, element.getAttribute(name));
    if (element.getAttribute(name) !== value) element.setAttribute(name, value);
  }

  private _setManagedStyle(element: HTMLElement, name: string, value: string): void {
    const state = this._managedState(element);
    if (!state.styles.has(name)) {
      state.styles.set(name, {
        priority: element.style.getPropertyPriority(name),
        value: element.style.getPropertyValue(name),
      });
    }
    if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
  }

  private _restoreManagedState(): void {
    for (const [element, state] of this._managed) {
      for (const [name, value] of state.attributes) {
        if (value === null) element.removeAttribute(name);
        else element.setAttribute(name, value);
      }
      for (const [name, style] of state.styles) {
        if (!style.value) element.style.removeProperty(name);
        else element.style.setProperty(name, style.value, style.priority);
      }
    }
    this._managed.clear();
  }

  private _warnOnce(message: string): void {
    if (this._warnings.has(message)) return;
    this._warnings.add(message);
    this.warn(message);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'nte-data-table': NteDataTableElement;
  }
}
