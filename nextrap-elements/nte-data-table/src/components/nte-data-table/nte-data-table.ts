import { nextrap_element } from '@nextrap/nt-core';
import { resetStyle } from '@nextrap/style-reset';
import { html, type PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import {
  nteDataTablePluginRegistry,
  type NteDataTablePlugin,
  type NteDataTablePluginContext,
} from '../../plugins/plugin-registry';
import style from './nte-data-table.scss?inline';

const DEFAULT_HEIGHT = '24rem';
const COLUMN_RESIZE_HIT_AREA = 8;
const MIN_COLUMN_WIDTH = 48;
const OWNED_ATTRIBUTES = {
  borderFree: 'data-nte-data-table-border-free',
  columnSelected: 'data-nte-data-table-column-selected',
  headerSelected: 'data-nte-data-table-header-selected',
  highlight: 'data-nte-data-table-highlight',
  hidden: 'data-nte-data-table-hidden',
  pinned: 'data-nte-data-table-pinned',
  rowSelected: 'data-nte-data-table-row-selected',
  sized: 'data-nte-data-table-sized',
} as const;

const HIGHLIGHT_CLASSES = ['primary', 'secondary', 'success', 'info', 'warning', 'danger'] as const;

export type NteDataTableRowTarget = number | string | HTMLTableRowElement;
export type NteDataTableColumnTarget = number | string | HTMLTableCellElement;

interface NteDataTableRemoteActions {
  clearSelection(): void;
  setColumnSelected(target: NteDataTableColumnTarget, selected: boolean): boolean;
  setRowSelected(target: NteDataTableRowTarget, selected: boolean): boolean;
  toggleColumn(target: NteDataTableColumnTarget): boolean;
  toggleRow(target: NteDataTableRowTarget): boolean;
}

export class NteDataTableRemote {
  public constructor(private readonly _actions: NteDataTableRemoteActions) {}

  public selectRow(target: NteDataTableRowTarget): boolean {
    return this._actions.setRowSelected(target, true);
  }
  public deselectRow(target: NteDataTableRowTarget): boolean {
    return this._actions.setRowSelected(target, false);
  }

  public toggleRow(target: NteDataTableRowTarget): boolean {
    return this._actions.toggleRow(target);
  }

  public selectColumn(target: NteDataTableColumnTarget): boolean {
    return this._actions.setColumnSelected(target, true);
  }

  public deselectColumn(target: NteDataTableColumnTarget): boolean {
    return this._actions.setColumnSelected(target, false);
  }

  public toggleColumn(target: NteDataTableColumnTarget): boolean {
    return this._actions.toggleColumn(target);
  }

  public clearSelection(): void {
    this._actions.clearSelection();
  }
}

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
  @property({ type: String }) public accessor features = '';
  @property({ type: Number, attribute: 'pinned-columns' }) public accessor pinnedColumns = 0;
  @property({ type: String, attribute: 'scroll-label' }) public accessor scrollLabel = '';
  @property({ type: String, reflect: true, attribute: 'aria-label' }) public override accessor ariaLabel = '';

  private _body: HTMLTableSectionElement | null = null;
  private _columnWidths: number[] = [];
  private _columnResize: ColumnResizeState | null = null;
  private _layoutFrame: number | null = null;
  private _managed = new Map<HTMLElement, ManagedState>();
  private _plugins = new Map<string, NteDataTablePlugin>();
  private _refreshWidths = true;
  private _resizableHeaders = new Set<HTMLTableCellElement>();
  private _resizeObserver: ResizeObserver | null = null;
  private _resizeTargets = new Set<Element>();
  private _selectedColumns = new Set<number>();
  private _selectedRows = new Set<HTMLTableRowElement>();
  private _sourceTable: HTMLTableElement | null = null;
  private _warnings = new Set<string>();
  private readonly _remote = new NteDataTableRemote({
    clearSelection: () => this._clearSelection(),
    setColumnSelected: (target, selected) => this._setColumnSelected(target, selected),
    setRowSelected: (target, selected) => this._setRowSelected(target, selected),
    toggleColumn: (target) => this._toggleColumn(target),
    toggleRow: (target) => this._toggleRow(target),
  });

  public get sourceTable(): HTMLTableElement | null {
    return this._sourceTable;
  }

  public get remote(): NteDataTableRemote {
    return this._remote;
  }

  public refresh(): void {
    for (const plugin of this._plugins.values()) plugin.refresh?.();
    this._refreshWidths = true;
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
    if (changedProperties.has('features')) this._syncPlugins();
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
    if (view?.ResizeObserver) {
      this._resizeObserver = new view.ResizeObserver(() => this._scheduleLayout());
    }
    this._syncPlugins();
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
    this._resizeObserver?.disconnect();
    this._resizeObserver = null;
    this._resizeTargets.clear();
    this._resizableHeaders.clear();
    this._disconnectPlugins();
    this._columnWidths = [];
    this._refreshWidths = true;
    this._clearSelection();
    this._cancelLayout();
    this._restoreManagedState();
    this._sourceTable = null;
  }

  private _pluginContext(table: HTMLTableElement): NteDataTablePluginContext {
    return {
      host: this,
      remote: this.remote,
      table,
      refresh: () => this.refresh(),
    };
  }

  private _syncPlugins(): void {
    const table = this._sourceTable;
    if (!table) return;
    const requested = new Set(
      (this.features ?? '')
        .split(/[\s,]+/)
        .map((name) => name.trim().toLowerCase())
        .filter(Boolean),
    );

    for (const [name, plugin] of this._plugins) {
      if (requested.has(name)) continue;
      plugin.disconnect();
      this._plugins.delete(name);
    }

    for (const name of requested) {
      if (this._plugins.has(name)) continue;
      const plugin = nteDataTablePluginRegistry.create(name);
      if (!plugin) {
        this._warnOnce(`nte-data-table feature is not registered: ${name}`);
        continue;
      }
      plugin.connect(this._pluginContext(table));
      this._plugins.set(name, plugin);
    }
    this._refreshWidths = true;
    this._scheduleLayout();
  }

  private _disconnectPlugins(): void {
    for (const plugin of this._plugins.values()) plugin.disconnect();
    this._plugins.clear();
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
    if (event.target instanceof Element && event.target.closest('.nte-data-table-plugin-control')) return;
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
    const width = Math.max(MIN_COLUMN_WIDTH, Math.round(resize.startWidth + delta));
    const columnIndex = Array.from(this._sourceTable?.tHead?.rows[0]?.cells ?? []).indexOf(resize.headerCell);
    if (columnIndex < 0) return;
    this._columnWidths[columnIndex] = width;
    resize.headerCell.dataset['width'] = `${width}px`;
    this._scheduleLayout();
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

    this._setBody(null);
    this._restoreManagedState();
    if (this._refreshWidths) this._columnWidths = [];
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
      this._setManagedStyle(table, 'inline-size', '100%');
      this._setManagedStyle(table, 'margin', '0px');
      this._setManagedStyle(table, 'overflow', 'visible');
      this._setManagedStyle(table, 'padding', '0px');

      const body = bodies[0];
      this._setManagedAttribute(body, 'tabindex', '0');
      this._setManagedStyle(body, 'box-sizing', 'border-box');
      this._setManagedStyle(body, 'display', 'block');
      this._setManagedStyle(body, 'block-size', this._safeHeight());
      this._setManagedStyle(body, 'inline-size', '100%');
      this._setManagedStyle(body, 'overflow-x', 'auto');
      this._setManagedStyle(body, 'overflow-y', 'auto');
      this._setManagedStyle(body, 'overscroll-behavior', 'contain');
      this._setManagedStyle(body, 'touch-action', 'pan-x pan-y');
      this._setManagedStyle(body, '-webkit-overflow-scrolling', 'touch');

      const visibleColumns: number[] = [];
      headerCells.forEach((headerCell, columnIndex) => {
        const hidden = headerCell.hidden || this._isDataHidden(headerCell);
        if (!hidden) visibleColumns.push(columnIndex);
        if (this._columnWidths[columnIndex] !== undefined) return;
        const configuredWidth = this._readColumnWidth(headerCell);
        if (!configuredWidth) return;
        this._setManagedStyle(headerCell, 'inline-size', configuredWidth);
        this._setManagedStyle(headerCell, 'min-inline-size', configuredWidth);
        this._setManagedStyle(headerCell, 'max-inline-size', configuredWidth);
      });

      headerCells.forEach((headerCell, columnIndex) => {
        this._columnWidths[columnIndex] ??= Math.max(
          MIN_COLUMN_WIDTH,
          Math.ceil(headerCell.getBoundingClientRect().width),
        );
      });
      const widths = [...this._columnWidths];
      const naturalWidth = visibleColumns.reduce((sum, columnIndex) => sum + widths[columnIndex], 0);
      const lastVisibleColumn = visibleColumns.at(-1);
      if (lastVisibleColumn !== undefined && naturalWidth < body.clientWidth) {
        widths[lastVisibleColumn] += body.clientWidth - naturalWidth;
      }

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
            if (row.parentElement?.tagName !== 'TBODY') this._setManagedStyle(cell, 'white-space', 'nowrap');
          }
        });
      });

      this._applyHeaderColumnStates(rows, headerCells);
      this._applySelectionState(rows);

      const totalWidth = visibleColumns.reduce((sum, columnIndex) => sum + widths[columnIndex], 0);
      const tableWidth = `${totalWidth}px`;
      const caption = table.caption;
      if (caption) {
        const viewportWidth = this.shadowRoot?.querySelector<HTMLElement>('#viewport')?.clientWidth ?? table.clientWidth;
        this._setManagedStyle(caption, 'box-sizing', 'border-box');
        this._setManagedStyle(caption, 'display', 'block');
        this._setManagedStyle(caption, 'inline-size', `${viewportWidth}px`);
      }
      this._configureSection(table.tHead!, tableWidth);
      if (table.tFoot) this._configureSection(table.tFoot, tableWidth);

      for (const row of Array.from(body.rows)) {
        this._setManagedStyle(row, 'display', 'table');
        this._setManagedStyle(row, 'table-layout', 'fixed');
        this._setManagedStyle(row, 'inline-size', tableWidth);
      }

      for (const columnIndex of visibleColumns) this._resizableHeaders.add(headerCells[columnIndex]);
      this._applyPinnedColumns(rows, headerCells, visibleColumns, widths);
      this._setBody(body);
      this._syncHorizontalScroll();
      this._refreshWidths = false;
    } finally {
      this._updateResizeTargets(table);
    }
  }

  private _configureSection(section: HTMLTableSectionElement, width: string): void {
    this._setManagedStyle(section, 'display', 'table');
    this._setManagedStyle(section, 'inline-size', width);
    this._setManagedStyle(section, 'table-layout', 'fixed');
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

  private _applyHeaderColumnStates(
    rows: HTMLTableRowElement[],
    headerCells: HTMLTableCellElement[],
  ): void {
    headerCells.forEach((headerCell, columnIndex) => {
      const highlight =
        HIGHLIGHT_CLASSES.find((name) => headerCell.classList.contains(`highlight-${name}`)) ??
        (headerCell.classList.contains('highlight') ? 'primary' : undefined);
      const selected = headerCell.classList.contains('selected');
      const borderFree = headerCell.classList.contains('border-free');

      for (const row of rows) {
        const cell = row.cells[columnIndex];
        if (highlight) this._setManagedAttribute(cell, OWNED_ATTRIBUTES.highlight, highlight);
        if (selected) this._setManagedAttribute(cell, OWNED_ATTRIBUTES.headerSelected, '');
        if (borderFree) this._setManagedAttribute(cell, OWNED_ATTRIBUTES.borderFree, '');
      }
    });
  }

  private _applySelectionState(rows: HTMLTableRowElement[]): void {
    for (const row of Array.from(this._selectedRows)) {
      if (!rows.includes(row)) this._selectedRows.delete(row);
    }

    for (const row of rows) {
      const selectedRow = this._selectedRows.has(row);
      row.toggleAttribute(OWNED_ATTRIBUTES.rowSelected, selectedRow);
      for (const cell of Array.from(row.cells)) {
        cell.toggleAttribute(OWNED_ATTRIBUTES.rowSelected, selectedRow);
      }
      for (const columnIndex of this._selectedColumns) {
        row.cells[columnIndex]?.setAttribute(OWNED_ATTRIBUTES.columnSelected, '');
      }
    }
  }

  private _setRowSelected(target: NteDataTableRowTarget, selected: boolean): boolean {
    const row = this._resolveRow(target);
    if (!row) return false;
    if (selected) this._selectedRows.add(row);
    else this._selectedRows.delete(row);
    this._applySelectionState(Array.from(this._sourceTable?.rows ?? []));
    return true;
  }

  private _toggleRow(target: NteDataTableRowTarget): boolean {
    const row = this._resolveRow(target);
    return row ? this._setRowSelected(row, !this._selectedRows.has(row)) : false;
  }

  private _setColumnSelected(target: NteDataTableColumnTarget, selected: boolean): boolean {
    const columnIndex = this._resolveColumn(target);
    if (columnIndex === null) return false;
    if (selected) this._selectedColumns.add(columnIndex);
    else this._selectedColumns.delete(columnIndex);
    this._clearSelectionMarkers(OWNED_ATTRIBUTES.columnSelected);
    this._applySelectionState(Array.from(this._sourceTable?.rows ?? []));
    return true;
  }

  private _toggleColumn(target: NteDataTableColumnTarget): boolean {
    const columnIndex = this._resolveColumn(target);
    return columnIndex === null
      ? false
      : this._setColumnSelected(columnIndex, !this._selectedColumns.has(columnIndex));
  }

  private _clearSelection(): void {
    this._selectedRows.clear();
    this._selectedColumns.clear();
    this._clearSelectionMarkers(OWNED_ATTRIBUTES.rowSelected);
    this._clearSelectionMarkers(OWNED_ATTRIBUTES.columnSelected);
  }

  private _clearSelectionMarkers(attribute: string): void {
    this._sourceTable?.querySelectorAll(`[${attribute}]`).forEach((element) => element.removeAttribute(attribute));
  }

  private _resolveRow(target: NteDataTableRowTarget): HTMLTableRowElement | null {
    const rows = Array.from(this._sourceTable?.tBodies[0]?.rows ?? []);
    if (typeof target === 'number') return rows[target] ?? null;
    if (target instanceof HTMLTableRowElement) return rows.includes(target) ? target : null;
    return rows.find((row) => row.id === target || row.dataset['rowId'] === target) ?? null;
  }

  private _resolveColumn(target: NteDataTableColumnTarget): number | null {
    const headers = Array.from(this._sourceTable?.tHead?.rows[0]?.cells ?? []);
    if (typeof target === 'number') return headers[target] ? target : null;
    if (target instanceof HTMLTableCellElement) {
      const index = headers.indexOf(target);
      return index < 0 ? null : index;
    }
    const index = headers.findIndex((header) => header.id === target || header.dataset['columnId'] === target);
    return index < 0 ? null : index;
  }

  private _updateResizeTargets(table: HTMLTableElement): void {
    if (!this._resizeObserver) return;
    const nextTargets = new Set<Element>();
    if (table.caption) nextTargets.add(table.caption);
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
