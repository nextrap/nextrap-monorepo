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

  private _body: HTMLTableSectionElement | null = null;
  private _columnResize: ColumnResizeState | null = null;
  private _layoutFrame: number | null = null;
  private _managed = new Map<HTMLElement, ManagedState>();
  private _mutationObserver: MutationObserver | null = null;
  private _resizableHeaders = new Set<HTMLTableCellElement>();
  private _resizeObserver: ResizeObserver | null = null;
  private _resizeTargets = new Set<Element>();
  private _sourceTable: HTMLTableElement | null = null;
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
      changedProperties.has('height') ||
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
        aria-label="${this._viewportLabel()}"
        style="block-size: ${this._safeHeight()};"
      >
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  private _handleSlotChange = (): void => this._bindSourceTable();

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

    sourceTable.addEventListener('pointerdown', this._handlePointerDown, true);
    sourceTable.addEventListener('pointermove', this._handlePointerMove, true);
    sourceTable.addEventListener('pointerup', this._handlePointerEnd, true);
    sourceTable.addEventListener('pointercancel', this._handlePointerEnd, true);
    sourceTable.addEventListener('lostpointercapture', this._handleLostPointerCapture, true);

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
    this._sourceTable?.removeEventListener('pointerdown', this._handlePointerDown, true);
    this._sourceTable?.removeEventListener('pointermove', this._handlePointerMove, true);
    this._sourceTable?.removeEventListener('pointerup', this._handlePointerEnd, true);
    this._sourceTable?.removeEventListener('pointercancel', this._handlePointerEnd, true);
    this._sourceTable?.removeEventListener('lostpointercapture', this._handleLostPointerCapture, true);
    this._setBody(null);
    this._finishColumnResize(false);
    this._mutationObserver?.disconnect();
    this._mutationObserver = null;
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._resizeTargets.clear();
    this._resizableHeaders.clear();
    this._cancelLayout();
    this._restoreManagedState();
    this._sourceTable = null;
  }

  private _setBody(body: HTMLTableSectionElement | null): void {
    if (body === this._body) return;
    this._body?.removeEventListener('scroll', this._handleBodyScroll);
    this._body = body;
    this._body?.addEventListener('scroll', this._handleBodyScroll, { passive: true });
  }

  private _handleBodyScroll = (): void => this._syncHorizontalScroll();

  private _syncHorizontalScroll(): void {
    const table = this._sourceTable;
    const body = this._body;
    if (!table || !body) return;

    const direction = this.ownerDocument.defaultView?.getComputedStyle(table).direction;
    const offset = this._normalizedScrollLeft(body, direction === 'rtl');
    const sectionTransform = `translateX(${-offset}px)`;
    if (table.tHead) this._setManagedStyle(table.tHead, 'transform', sectionTransform);
    if (table.tFoot) this._setManagedStyle(table.tFoot, 'transform', sectionTransform);

    for (const section of [table.tHead, table.tFoot]) {
      if (!section) continue;
      for (const cell of Array.from(section.querySelectorAll<HTMLElement>(`[${OWNED_ATTRIBUTES.pinned}]`))) {
        this._setManagedStyle(cell, 'transform', `translateX(${offset}px)`);
      }
    }
  }

  private _normalizedScrollLeft(body: HTMLElement, rtl: boolean): number {
    if (!rtl) return body.scrollLeft;
    const max = body.scrollWidth - body.clientWidth;
    return body.scrollLeft < 0 ? -body.scrollLeft : max - body.scrollLeft;
  }

  private _handlePointerDown = (event: PointerEvent): void => {
    if (event.button !== 0 || !event.isPrimary || this._columnResize) return;
    const headerCell = this._resizeCellAt(event);
    if (!headerCell) return;

    event.preventDefault();
    const direction = this.ownerDocument.defaultView?.getComputedStyle(this._sourceTable!).direction;
    this._columnResize = {
      direction: direction === 'rtl' ? -1 : 1,
      headerCell,
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startWidth: headerCell.getBoundingClientRect().width,
    };
    this._setManagedStyle(headerCell, 'cursor', 'col-resize');
    headerCell.setPointerCapture?.(event.pointerId);
  };

  private _handlePointerMove = (event: PointerEvent): void => {
    const resize = this._columnResize;
    if (!resize) {
      const cell = this._resizeCellAt(event);
      for (const header of this._resizableHeaders) {
        this._setManagedStyle(header, 'cursor', header === cell ? 'col-resize' : '');
      }
      return;
    }
    if (resize.pointerId !== event.pointerId) return;

    event.preventDefault();
    const delta = (event.clientX - resize.startClientX) * resize.direction;
    resize.headerCell.dataset['width'] = `${Math.max(
      MIN_COLUMN_WIDTH,
      Math.round(resize.startWidth + delta),
    )}px`;
  };

  private _handlePointerEnd = (event: PointerEvent): void => {
    if (this._columnResize?.pointerId !== event.pointerId) return;
    event.preventDefault();
    this._finishColumnResize();
  };

  private _handleLostPointerCapture = (event: PointerEvent): void => {
    if (this._columnResize?.pointerId === event.pointerId) this._finishColumnResize(false);
  };

  private _resizeCellAt(event: PointerEvent): HTMLTableCellElement | null {
    const target = event.target;
    if (!(target instanceof Element)) return null;
    const headerCell = target.closest<HTMLTableCellElement>('th, td');
    if (!headerCell || !this._resizableHeaders.has(headerCell)) return null;

    const bounds = headerCell.getBoundingClientRect();
    const rtl = this.ownerDocument.defaultView?.getComputedStyle(this._sourceTable!).direction === 'rtl';
    const distance = rtl ? event.clientX - bounds.left : bounds.right - event.clientX;
    return distance >= 0 && distance <= COLUMN_RESIZE_HIT_AREA ? headerCell : null;
  }

  private _finishColumnResize(releaseCapture = true): void {
    const resize = this._columnResize;
    if (!resize) return;
    this._columnResize = null;
    if (releaseCapture && resize.headerCell.hasPointerCapture?.(resize.pointerId)) {
      resize.headerCell.releasePointerCapture?.(resize.pointerId);
    }
    this._setManagedStyle(resize.headerCell, 'cursor', '');
    this._scheduleLayout();
  }

  private _observeSourceTable(): void {
    if (!this._sourceTable || !this._mutationObserver) return;
    this._mutationObserver.observe(this._sourceTable, {
      attributeFilter: ['aria-label', 'colspan', 'data-hidden', 'data-width', 'hidden', 'rowspan', 'style', 'width'],
      attributes: true,
      attributeOldValue: true,
      characterData: true,
      childList: true,
      subtree: true,
    });
  }

  private _handleMutations = (records: MutationRecord[]): void => {
    if (records.some((record) => !this._isScrollSyncMutation(record))) this._scheduleLayout();
  };

  private _isScrollSyncMutation(record: MutationRecord): boolean {
    if (record.type !== 'attributes' || record.attributeName !== 'style' || !(record.target instanceof HTMLElement)) {
      return false;
    }
    return this._styleWithoutOwnedProperties(record.oldValue) === this._styleWithoutOwnedProperties(record.target.style.cssText);
  }

  private _styleWithoutOwnedProperties(value: string | null): string {
    const probe = this.ownerDocument.createElement('div');
    probe.style.cssText = value ?? '';
    probe.style.removeProperty('cursor');
    probe.style.removeProperty('transform');
    return probe.style.cssText;
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
    this._setBody(null);
    this._restoreManagedState();
    this._resizableHeaders.clear();
    let headerCells: HTMLTableCellElement[] = [];

    try {
      this._updateViewportLabel(table);
      const headerRow = table.tHead?.rows[0];
      const bodies = Array.from(table.tBodies);
      if (!headerRow || table.tHead?.rows.length !== 1 || bodies.length !== 1 || (table.tFoot && table.tFoot.rows.length !== 1)) {
        this._warnOnce('nte-data-table requires one header row, one tbody and at most one footer row.');
        return;
      }

      headerCells = Array.from(headerRow.cells);
      const rows = Array.from(table.rows);
      const columnCount = headerCells.length;
      const rectangular =
        columnCount > 0 &&
        rows.every(
          (row) =>
            row.cells.length === columnCount &&
            Array.from(row.cells).every((cell) => cell.colSpan === 1 && cell.rowSpan === 1),
        );
      if (!rectangular) {
        this._warnOnce('nte-data-table width, hide and pin enhancements do not support colspan or rowspan.');
        return;
      }

      this._setManagedStyle(table, 'border-collapse', 'separate');
      this._setManagedStyle(table, 'border-spacing', '0px');
      this._setManagedStyle(table, 'display', 'block');
      this._setManagedStyle(table, 'block-size', '100%');
      this._setManagedStyle(table, 'inline-size', '100%');
      this._setManagedStyle(table, 'overflow', 'hidden');
      this._setManagedStyle(table, 'position', 'relative');

      const visibleColumns: number[] = [];
      const widths: number[] = [];
      headerCells.forEach((headerCell, columnIndex) => {
        const hidden = headerCell.hidden || this._isDataHidden(headerCell);
        if (!hidden) visibleColumns.push(columnIndex);
        const configuredWidth = this._readColumnWidth(headerCell);
        if (configuredWidth) {
          this._setManagedStyle(headerCell, 'inline-size', configuredWidth);
          this._setManagedStyle(headerCell, 'min-inline-size', configuredWidth);
          this._setManagedStyle(headerCell, 'max-inline-size', configuredWidth);
        }
        widths[columnIndex] = Math.max(MIN_COLUMN_WIDTH, Math.ceil(headerCell.getBoundingClientRect().width));
      });

      rows.forEach((row) => {
        Array.from(row.cells).forEach((cell, columnIndex) => {
          const hidden = !visibleColumns.includes(columnIndex);
          const width = `${widths[columnIndex]}px`;
          this._setManagedStyle(cell, 'box-sizing', 'border-box');
          if (hidden) {
            this._setManagedAttribute(cell, OWNED_ATTRIBUTES.hidden, '');
            this._setManagedStyle(cell, 'display', 'none');
          } else {
            this._setManagedAttribute(cell, OWNED_ATTRIBUTES.sized, '');
            this._setManagedStyle(cell, 'inline-size', width);
            this._setManagedStyle(cell, 'min-inline-size', width);
            this._setManagedStyle(cell, 'max-inline-size', width);
          }
        });
      });

      const totalWidth = visibleColumns.reduce((sum, columnIndex) => sum + widths[columnIndex], 0);
      const tableWidth = `${Math.max(totalWidth, table.clientWidth)}px`;
      this._positionSection(table.tHead!, '0px', null, tableWidth);
      if (table.tFoot) this._positionSection(table.tFoot, null, '0px', tableWidth);

      const body = bodies[0];
      this._setManagedAttribute(body, 'tabindex', '0');
      this._setManagedStyle(body, 'box-sizing', 'border-box');
      this._setManagedStyle(body, 'display', 'block');
      this._setManagedStyle(body, 'block-size', '100%');
      this._setManagedStyle(body, 'inline-size', '100%');
      this._setManagedStyle(body, 'overflow', 'auto');
      this._setManagedStyle(body, 'overscroll-behavior', 'contain');
      this._setManagedStyle(body, 'padding-block-start', `${Math.ceil(table.tHead!.getBoundingClientRect().height)}px`);
      const footerHeight = Math.ceil(table.tFoot?.getBoundingClientRect().height ?? 0);
      this._setManagedStyle(body, 'padding-block-end', `${footerHeight}px`);
      for (const row of Array.from(body.rows)) {
        this._setManagedStyle(row, 'display', 'table');
        this._setManagedStyle(row, 'table-layout', 'fixed');
        this._setManagedStyle(row, 'inline-size', tableWidth);
      }

      const horizontalScrollbarHeight = Math.max(0, body.offsetHeight - body.clientHeight);
      if (table.tFoot) this._setManagedStyle(table.tFoot, 'inset-block-end', `${horizontalScrollbarHeight}px`);
      this._setManagedStyle(body, 'padding-block-end', `${footerHeight + horizontalScrollbarHeight}px`);

      for (const columnIndex of visibleColumns) this._resizableHeaders.add(headerCells[columnIndex]);
      this._applyPinnedColumns(rows, headerCells, visibleColumns, widths);
      this._setBody(body);
      this._syncHorizontalScroll();
    } finally {
      this._updateResizeTargets(table, headerCells);
      this._observeSourceTable();
    }
  }

  private _positionSection(
    section: HTMLTableSectionElement,
    top: string | null,
    bottom: string | null,
    width: string,
  ): void {
    this._setManagedStyle(section, 'display', 'table');
    this._setManagedStyle(section, 'inline-size', width);
    this._setManagedStyle(section, 'position', 'absolute');
    this._setManagedStyle(section, 'inset-inline-start', '0px');
    this._setManagedStyle(section, 'table-layout', 'fixed');
    this._setManagedStyle(section, 'z-index', '3');
    if (top !== null) this._setManagedStyle(section, 'inset-block-start', top);
    if (bottom !== null) this._setManagedStyle(section, 'inset-block-end', bottom);
  }

  private _applyPinnedColumns(
    rows: HTMLTableRowElement[],
    headerCells: HTMLTableCellElement[],
    visibleColumns: number[],
    widths: number[],
  ): void {
    const pinnedCount = Math.min(this._safePinnedColumns(), visibleColumns.length);
    let offset = 0;
    for (const columnIndex of visibleColumns.slice(0, pinnedCount)) {
      for (const row of rows) {
        const cell = row.cells[columnIndex];
        this._setManagedAttribute(cell, OWNED_ATTRIBUTES.pinned, '');
        this._setManagedStyle(cell, 'position', 'sticky');
        this._setManagedStyle(cell, 'inset-inline-start', `${offset}px`);
        this._setManagedStyle(cell, 'z-index', row.parentElement?.tagName === 'TBODY' ? '2' : '4');
      }
      offset += widths[columnIndex];
    }
  }

  private _updateResizeTargets(table: HTMLTableElement, headerCells: HTMLTableCellElement[]): void {
    if (!this._resizeObserver) return;
    const nextTargets = new Set<Element>([table, ...headerCells, ...Array.from(table.tBodies)]);
    const viewport = this.shadowRoot?.querySelector<HTMLElement>('#viewport');
    if (viewport) nextTargets.add(viewport);
    for (const target of this._resizeTargets) if (!nextTargets.has(target)) this._resizeObserver.unobserve(target);
    for (const target of nextTargets) if (!this._resizeTargets.has(target)) this._resizeObserver.observe(target);
    this._resizeTargets = nextTargets;
  }

  private _readColumnWidth(headerCell: HTMLTableCellElement): string | null {
    let value =
      headerCell.dataset['width']?.trim() || headerCell.style.width.trim() || headerCell.getAttribute('width')?.trim();
    if (!value) return null;
    if (/^\d+(?:\.\d+)?$/.test(value)) value = `${value}px`;
    const css = this.ownerDocument.defaultView?.CSS;
    if (!css || css.supports('width', value)) return value;
    this._warnOnce(`nte-data-table ignored invalid column width: ${value}`);
    return null;
  }

  private _isDataHidden(headerCell: HTMLTableCellElement): boolean {
    return headerCell.hasAttribute('data-hidden') && headerCell.getAttribute('data-hidden') !== 'false';
  }

  private _safePinnedColumns(): number {
    return Number.isFinite(this.pinnedColumns) ? Math.max(0, Math.floor(this.pinnedColumns)) : 0;
  }

  private _safeHeight(): string {
    const height = (this.height ?? '').trim();
    const css = this.ownerDocument.defaultView?.CSS;
    return height && (!css || css.supports('height', height)) ? height : DEFAULT_HEIGHT;
  }

  private _validateHeight(): void {
    if (this._safeHeight() === DEFAULT_HEIGHT && (this.height ?? '').trim() !== DEFAULT_HEIGHT) {
      this._warnOnce(`nte-data-table ignored invalid height: ${this.height}`);
    }
  }

  private _viewportLabel(): string {
    return (this.scrollLabel ?? '').trim() || (this.ariaLabel ?? '').trim() || 'Data table';
  }

  private _updateViewportLabel(table: HTMLTableElement): void {
    const label =
      (this.scrollLabel ?? '').trim() ||
      (this.ariaLabel ?? '').trim() ||
      table.getAttribute('aria-label')?.trim() ||
      table.caption?.textContent?.trim() ||
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
      for (const [name, savedStyle] of state.styles) {
        if (!savedStyle.value) element.style.removeProperty(name);
        else element.style.setProperty(name, savedStyle.value, savedStyle.priority);
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
