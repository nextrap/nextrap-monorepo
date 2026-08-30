export type TableCellContent = Node | string | number | boolean | null | undefined;
export type TableSortDirection = 'ascending' | 'descending';

export interface TableSortState {
  columnId: string;
  direction: TableSortDirection;
}

export interface TableColumnDefinition<T extends object> {
  id: string;
  header: string;
  field?: keyof T;
  value?: (row: T) => unknown;
  render?: (value: unknown, row: T) => TableCellContent;
  preset?: string;
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  hidden?: boolean;
  resizable?: boolean;
  reorderable?: boolean;
  sortable?: boolean;
}

export interface TableDefinition<T extends object> {
  id: string;
  columns: TableColumnDefinition<T>[];
  rowId: keyof T | ((row: T) => string);
  preset?: string;
}

export interface TableViewState {
  columnOrder?: string[];
  columnWidths?: Record<string, number>;
  hiddenColumns?: string[];
  pinnedColumns?: string[];
  sort?: TableSortState[];
}

export type TableViewStateChangeReason = 'column-resize' | 'column-reorder' | 'sort' | 'programmatic';
export interface TableViewStateChangeDetail {
  reason: TableViewStateChangeReason;
  state: TableViewState;
}
