import '@nextrap/nte-table';
import { nextrap_element } from '@nextrap/nt-core';
import type { NteTableElement } from '@nextrap/nte-table';
import { resetStyle } from '@nextrap/style-reset';
import { html, nothing, type PropertyValues, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { TableColumnDefinition, TableDefinition, TableSortState, TableViewState, TableViewStateChangeDetail, TableViewStateChangeReason } from '../../definitions/table-definition';
import { nteDataTableCellRendererRegistry } from '../../rendering/cell-renderer-registry';
import style from './nte-data-table.scss?inline';

type DataRow = Record<string, unknown>;

@customElement('nte-data-table')
export class NteDataTableElement<T extends DataRow = DataRow> extends nextrap_element({ eventBinding: false, slotVisibility: false }) {
  static override styles = [unsafeCSS(resetStyle), unsafeCSS(style)];

  @property({ attribute: false }) public accessor data: readonly T[] = [];
  @property({ attribute: false }) public accessor definition: TableDefinition<T> | null = null;
  @property({ attribute: false }) public accessor viewState: TableViewState = {};
  @property({ type: String }) public accessor features = 'resize-columns reorder-columns sort';
  @property({ type: String }) public accessor height = '24rem';
  @property({ type: String, attribute: 'scroll-label' }) public accessor scrollLabel = '';

  public getViewState(): TableViewState { return structuredClone(this.viewState); }
  public setViewState(state: TableViewState): void { this._setViewState(state, 'programmatic'); }
  public refresh(): void { this.renderRoot.querySelector<NteTableElement>('nte-table')?.refresh(); }

  protected override updated(changed: PropertyValues): void {
    super.updated(changed);
    if (changed.has('definition')) this._validateDefinition();
  }

  protected override render() {
    const definition = this.definition;
    if (!definition) return nothing;
    const columns = this._columns(definition);
    const rows = this._rows(definition, columns);
    const pinned = new Set(this.viewState.pinnedColumns ?? []);
    const pinnedCount = columns.findIndex((column) => !pinned.has(column.id));
    return html`
      <nte-table
        .features=${this.features}
        .height=${this.height}
        .pinnedColumns=${pinnedCount < 0 ? columns.length : pinnedCount}
        .scrollLabel=${this.scrollLabel || definition.id}
        @nte-table-column-resize=${this._handleResize}
        @nte-table-column-reorder=${this._handleReorder}
        @nte-table-sort=${this._handleSort}
      >
        <table>
          <thead><tr>
            ${columns.map((column) => html`<th
              scope="col"
              data-column-id=${column.id}
              data-width=${this._width(column) ?? nothing}
              data-resizable=${column.resizable === false ? 'false' : nothing}
              data-reorderable=${column.reorderable === false ? 'false' : nothing}
              data-sortable=${column.sortable === false ? 'false' : nothing}
              ?hidden=${this._hidden(column)}
            >${column.header}</th>`)}
          </tr></thead>
          <tbody>${rows.map((row) => html`<tr data-row-id=${this._rowId(definition, row)}>
            ${columns.map((column) => html`<td>${this._cell(column, row)}</td>`)}
          </tr>`)}</tbody>
        </table>
      </nte-table>
    `;
  }

  private _validateDefinition(): void {
    const ids = this.definition?.columns.map((column) => column.id.trim()) ?? [];
    if (ids.some((id) => !id) || new Set(ids).size !== ids.length) throw new TypeError('TableDefinition column IDs must be non-empty and unique.');
  }
  private _columns(definition: TableDefinition<T>): TableColumnDefinition<T>[] {
    const byId = new Map(definition.columns.map((column) => [column.id, column]));
    const requested = (this.viewState.columnOrder ?? []).filter((id) => byId.has(id));
    return [...requested.map((id) => byId.get(id)!), ...definition.columns.filter((column) => !requested.includes(column.id))];
  }
  private _rows(definition: TableDefinition<T>, columns: TableColumnDefinition<T>[]): T[] {
    const rows = [...this.data], sort = this.viewState.sort?.[0];
    if (!sort) return rows;
    const column = columns.find((item) => item.id === sort.columnId);
    if (!column) return rows;
    const factor = sort.direction === 'ascending' ? 1 : -1;
    return rows.sort((left, right) => String(this._value(column, left) ?? '').localeCompare(String(this._value(column, right) ?? ''), undefined, { numeric: true }) * factor);
  }
  private _rowId(definition: TableDefinition<T>, row: T): string {
    return typeof definition.rowId === 'function' ? definition.rowId(row) : String(row[definition.rowId] ?? '');
  }
  private _value(column: TableColumnDefinition<T>, row: T): unknown {
    return column.value ? column.value(row) : column.field === undefined ? undefined : row[column.field];
  }
  private _cell(column: TableColumnDefinition<T>, row: T) {
    const value = this._value(column, row);
    return column.render?.(value, row) ?? (column.preset ? nteDataTableCellRendererRegistry.get(column.preset)?.(value) : undefined) ?? (value == null ? '' : String(value));
  }
  private _width(column: TableColumnDefinition<T>): number | undefined { return this.viewState.columnWidths?.[column.id] ?? column.defaultWidth; }
  private _hidden(column: TableColumnDefinition<T>): boolean { return column.hidden === true || (this.viewState.hiddenColumns ?? []).includes(column.id); }
  private _setViewState(state: TableViewState, reason: TableViewStateChangeReason): void {
    this.viewState = structuredClone(state);
    this.dispatchEvent(new CustomEvent<TableViewStateChangeDetail>('nte-data-table-view-state-change', { bubbles: true, composed: true, detail: { reason, state: this.getViewState() } }));
  }
  private _handleResize = (event: CustomEvent<{ columnId: string; width: number }>): void => {
    event.stopPropagation();
    const column = this.definition?.columns.find((item) => item.id === event.detail.columnId);
    const width = Math.max(column?.minWidth ?? 48, Math.min(column?.maxWidth ?? Infinity, event.detail.width));
    this._setViewState({ ...this.viewState, columnWidths: { ...this.viewState.columnWidths, [event.detail.columnId]: width } }, 'column-resize');
  };
  private _handleReorder = (event: CustomEvent<{ from: number; to: number }>): void => {
    event.stopPropagation();
    if (!this.definition) return;
    const order = this._columns(this.definition).map((column) => column.id);
    const [moved] = order.splice(event.detail.from, 1); order.splice(event.detail.to, 0, moved);
    this._setViewState({ ...this.viewState, columnOrder: order }, 'column-reorder');
  };
  private _handleSort = (event: CustomEvent<{ columnIndex: number; direction: TableSortState['direction'] }>): void => {
    event.stopPropagation();
    if (!this.definition) return;
    const column = this._columns(this.definition)[event.detail.columnIndex];
    if (column) this._setViewState({ ...this.viewState, sort: [{ columnId: column.id, direction: event.detail.direction }] }, 'sort');
  };
}

declare global { interface HTMLElementTagNameMap { 'nte-data-table': NteDataTableElement; } }
