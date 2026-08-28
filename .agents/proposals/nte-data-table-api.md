# NTE Data Table – API-Anhang

**Status:** Proposed  
**Gehört zu:** [nte-data-table.md](./nte-data-table.md)

Dieser Anhang präzisiert die öffentliche TypeScript-, Attribut-, Methoden- und Event-API. Namen können im Review noch angepasst werden; Schichtengrenzen und Semantik sollen danach stabil bleiben.

## Konventionen und Defaults

```ts
import type { TemplateResult } from "lit";

export type NteDataTableRowId = string | number;
export type NteDataTableColumnId = string;
export type NteDataTableSource =
  | "pointer"
  | "keyboard"
  | "api"
  | "restore"
  | "connector";

export type NteDataTableSelectionMode = "none" | "single" | "multiple";
export type NteDataTablePin = "start" | "end";
export type NteDataTableSortDirection = "asc" | "desc";
export type NteDataTableInteractionMode = "auto" | "table" | "grid";
export type NteDataTableLayoutMode = "scroll" | "fit";
```

Defaults:

| Option | Default |
| --- | --- |
| `interactionMode` | `"auto"` |
| `layoutMode` | `"scroll"` |
| `readOnly` | `false` |
| Row-/Column-Selection | `"none"` |
| Sort mode | `"single"` |
| Editing | deaktiviert |
| Edit activation | `"double-click"` plus Keyboard `Enter`/`F2` |
| Edit commit | `"blur-or-enter"` |
| `width` / `minWidth` / `maxWidth` | `160` / `80` / `600` CSS px |
| `resizable` | `true` |
| `sortable`, `searchable`, `editable`, `reorderable` | `false` |
| `cellType` | `"text"` |
| `pinned` | ungepinnt |
| Layout-Persistenz | nur mit explizitem Key/Opt-in |

`readonly` ist das boolesche HTML-Attribut; `readOnly` ist die entsprechende TypeScript-Property.

## Column Schema

Ein Column Accessor ist entweder ein Feld oder eine berechnete Funktion. Die Union verhindert doppeldeutige Konfiguration.

```ts
export interface NteDataTableCellContext<Row extends object, Value = unknown> {
  row: Readonly<Row>;
  rowId: NteDataTableRowId;
  rowIndex: number;
  columnId: NteDataTableColumnId;
  value: Value;
  signal?: AbortSignal;
}

export type NteDataTableCellRenderer<
  Row extends object,
  Value = unknown
> = (
  context: NteDataTableCellContext<Row, Value>
) => Node | string | TemplateResult;

export interface NteDataTableSelectOption<Value = unknown> {
  value: Value;
  label: string;
  disabled?: boolean;
}

export interface NteDataTableSelectEditor<Row extends object, Value = unknown> {
  type: "select";
  options:
    | readonly NteDataTableSelectOption<Value>[]
    | ((
        context: NteDataTableCellContext<Row, Value> & {
          signal: AbortSignal;
        }
      ) =>
        | readonly NteDataTableSelectOption<Value>[]
        | Promise<readonly NteDataTableSelectOption<Value>[]>);
}

export interface NteDataTableMountedEditor<Value = unknown> {
  element: HTMLElement;
  readValue(): Value;
  focus(): void;
  destroy?(): void;
}

export type NteDataTableEditorFactory<
  Row extends object,
  Value = unknown
> = (
  context: NteDataTableCellContext<Row, Value>
) => NteDataTableMountedEditor<Value>;

interface NteDataTableColumnBase<Row extends object, Value = unknown> {
  id: NteDataTableColumnId;
  label: string;
  ariaLabel?: string;
  queryKey?: string;

  width?: number;
  minWidth?: number;
  maxWidth?: number;
  flex?: number;
  pinned?: NteDataTablePin;

  resizable?: boolean;
  sortable?: boolean;
  searchable?: boolean;
  reorderable?: boolean;
  selectable?: boolean;

  cellType?: string;
  renderer?: NteDataTableCellRenderer<Row, Value>;
  editor?:
    | "text"
    | NteDataTableSelectEditor<Row, Value>
    | NteDataTableEditorFactory<Row, Value>;

  editable?:
    | boolean
    | ((context: NteDataTableCellContext<Row, Value>) => boolean);

  parse?: (
    input: unknown,
    context: NteDataTableCellContext<Row, Value>
  ) => Value | Promise<Value>;

  validate?: (
    value: Value,
    context: NteDataTableCellContext<Row, Value>
  ) => void | string | Promise<void | string>;

  sortValue?: (
    value: Value,
    context: NteDataTableCellContext<Row, Value>
  ) => unknown;

  compare?: (
    left: unknown,
    right: unknown,
    direction: NteDataTableSortDirection
  ) => number;

  searchText?: (
    value: Value,
    context: NteDataTableCellContext<Row, Value>
  ) => string;
}

export type NteDataTableColumn<
  Row extends object,
  Value = unknown
> =
  | (NteDataTableColumnBase<Row, Value> & {
      field: keyof Row;
      value?: never;
      setValue?: (
        row: Readonly<Row>,
        value: Value
      ) => Row | Promise<Row>;
    })
  | (NteDataTableColumnBase<Row, Value> & {
      field?: never;
      value: (row: Readonly<Row>) => Value;
      setValue?: (
        row: Readonly<Row>,
        value: Value
      ) => Row | Promise<Row>;
    });
```

Regeln:

- Ein berechneter Accessor ist nur editierbar, wenn `setValue()` eine Ersatzzeile liefert.
- Bei einem `field` ohne `setValue()` erzeugt der Array-Modus selbst eine flache Ersatzzeile.
- Explizite Column-Hooks überschreiben nur die gleichnamige Funktion des Cell Types.
- Nicht überschriebene Renderer-, Editor-, Parse-, Validate-, Sort- und Search-Hooks kommen weiterhin aus dem Cell Type.
- Renderer-Strings sind Text, niemals HTML.
- `queryKey` wird als `column.queryKey`, dann String-`field`, dann `column.id` aufgelöst.
- Breiten werden auf ganze, endliche CSS-Pixel und den Min-/Max-Bereich normalisiert.

## Konfiguration und Daten-Ownership

```ts
export interface NteDataTableSelectionConfig {
  rows?: NteDataTableSelectionMode;
  columns?: NteDataTableSelectionMode;
}

export interface NteDataTableEditingConfig {
  enabled?: boolean;
  activation?: "double-click";
  commit?: "blur-or-enter";
  optimistic?: boolean;
}

export interface NteDataTableSortingConfig {
  mode?: "single" | "multiple";
}

interface NteDataTableBaseConfig<Row extends object> {
  columns: readonly NteDataTableColumn<Row>[];

  interactionMode?: NteDataTableInteractionMode;
  layoutMode?: NteDataTableLayoutMode;
  readOnly?: boolean;

  selection?: NteDataTableSelectionConfig;
  editing?: NteDataTableEditingConfig;
  sorting?: NteDataTableSortingConfig;
  rowReordering?: boolean;

  initialQuery?: Partial<NteDataTableQueryState>;
  initialSelection?: Partial<NteDataTableSelectionState>;

  layoutStore?: NteDataTableLayoutStore | null;
  persistenceKey?: string;
  persistLayout?: boolean;
  schemaKey?: string;
}

export type NteDataTableConfig<Row extends object> =
  | (NteDataTableBaseConfig<Row> & {
      rows: readonly Row[];
      getRowId(row: Readonly<Row>): NteDataTableRowId;
      connector?: never;
    })
  | (NteDataTableBaseConfig<Row> & {
      connector: NteDataTableConnector<Row>;
      rows?: never;
      getRowId?: never;
    });
```

`configure()` kopiert das Array, aber nicht vorsorglich jedes Objekt tief. Erst eine Änderung ersetzt die betroffene Zeile und das Array. Der Caller behält seine ursprünglichen Objekte unverändert. In Connector-Modus sind die geladenen Rows Snapshots der autoritativen Quelle.

Persistenz wird aktiviert, wenn `persistLayout: true` oder ein `persistenceKey` gesetzt ist. `persistLayout: false` und `layoutStore: null` haben Vorrang. Für implizites Opt-in muss der Host eine stabile `id` haben; andernfalls wird nicht geschrieben.

## Öffentlicher State

```ts
export interface NteDataTableSort {
  columnId: NteDataTableColumnId;
  direction: NteDataTableSortDirection;
}

export interface NteDataTableQueryState {
  search: string;
  sort: readonly NteDataTableSort[];
}

export interface NteDataTableSelectionState {
  rowIds: readonly NteDataTableRowId[];
  columnIds: readonly NteDataTableColumnId[];
  activeCell?: {
    rowId: NteDataTableRowId;
    columnId: NteDataTableColumnId;
  };
  rowAnchorId?: NteDataTableRowId;
  columnAnchorId?: NteDataTableColumnId;
}

export interface NteDataTableLayoutState {
  order: readonly NteDataTableColumnId[];
  widths: Readonly<Record<NteDataTableColumnId, number>>;
  pinned: Readonly<
    Partial<Record<NteDataTableColumnId, NteDataTablePin>>
  >;
  hidden: readonly NteDataTableColumnId[];
}

export interface NteDataTableEditState {
  rowId: NteDataTableRowId;
  columnId: NteDataTableColumnId;
  originalValue: unknown;
  draftValue: unknown;
  status: "editing" | "validating" | "saving" | "error";
  validationError?: string;
}

export interface NteDataTableState<Row extends object> {
  query: Readonly<NteDataTableQueryState>;
  selection: Readonly<NteDataTableSelectionState>;
  layout: Readonly<NteDataTableLayoutState>;
  edit?: Readonly<NteDataTableEditState>;
  data: Readonly<{
    rows: readonly Row[];
    status: "idle" | "loading" | "ready" | "error";
    totalRowCount: number | null;
    loadedStart: number;
    requestId: number;
    error?: unknown;
  }>;
}
```

`getState()` gibt einen unveränderlichen Snapshot zurück. `totalRowCount: null` bedeutet unbekannt und wird im Grid als `aria-rowcount="-1"` ausgegeben.

## Connector-Vertrag

Der Connector kennt keine DOM- oder UI-Spaltendefinition. Er erhält nur aufgelöste Query-Deskriptoren.

```ts
export interface NteDataTableResolvedSort {
  columnId: NteDataTableColumnId;
  queryKey: string;
  direction: NteDataTableSortDirection;
}

export interface NteDataTableConnectorQuery {
  search: null | {
    value: string;
    queryKeys: readonly string[];
  };
  sort: readonly NteDataTableResolvedSort[];
  range?: {
    start: number;
    size: number;
  };
}

export interface NteDataTableReadResult<Row extends object> {
  rows: readonly Row[];
  start: number;
  totalRowCount: number | null;
  revision?: string;
}

export interface NteDataTableCellMutation {
  rowId: NteDataTableRowId;
  columnId: NteDataTableColumnId;
  queryKey: string;
  previousValue: unknown;
  value: unknown;
  baseRevision?: string;
}

export interface NteDataTableConnectorCapabilities {
  search: boolean;
  sorting: "none" | "single" | "multiple";
  rangeRead: boolean;
}

export interface NteDataTableConnector<Row extends object> {
  getRowId(row: Readonly<Row>): NteDataTableRowId;

  readonly capabilities?: Partial<NteDataTableConnectorCapabilities>;

  read(
    query: Readonly<NteDataTableConnectorQuery>,
    context: { signal: AbortSignal }
  ): Promise<NteDataTableReadResult<Row>>;

  updateCells?(
    mutations: readonly NteDataTableCellMutation[],
    context: { signal: AbortSignal }
  ): Promise<{
    updatedRows?: readonly Row[];
    revision?: string;
  }>;

  moveRows?(
    request: {
      rowIds: readonly NteDataTableRowId[];
      beforeRowId: NteDataTableRowId | null;
    },
    context: { signal: AbortSignal }
  ): Promise<void>;
}
```

MVP-Regeln:

- `read()` ist Pflicht und muss `AbortSignal` beachten.
- Fehlende Capabilities bedeuten `search: false`, `sorting: "none"` und `rangeRead: false`.
- Die Komponentenoption bestimmt, ob eine Funktion sichtbar/bedienbar ist; Capabilities bestimmen, ob die Datenquelle sie ausführen kann. Beides muss passen.
- Das Vorhandensein von `updateCells()` beziehungsweise `moveRows()` ist die Mutation-Capability.
- `updateCells()` mit `updatedRows` patcht anhand stabiler Row-ID. Ohne `updatedRows` lädt die Tabelle den aktuellen Bereich neu.
- Phase 1 liest den vollständigen Datensatz und lässt `range` weg. Phase 3 verwendet Offset/Size; Cursor-Pagination ist nicht Teil dieses Vertrags.
- Filter und Live-Subscription sind bewusst nicht untypisiert im MVP. Phase 2 ergänzt eigenständige, typisierte Erweiterungsverträge.
- Eine Antwort einer älteren `requestId` darf den aktuellen State nicht überschreiben.

### Mitgelieferter Array-Connector

```ts
new NteArrayDataTableConnector(rows, {
  getRowId: row => row.id
});
```

Der Array-Connector:

- kopiert die Eingabesequenz;
- löst Suche und Sortierung über Column-/Cell-Type-Hooks auf;
- ist stabil bei gleicher Vergleichswertung;
- ordnet `null`/`undefined` deterministisch;
- mutiert Caller-Zeilen nicht;
- unterstützt Updates durch Ersatzzeilen;
- kann für Tests künstliche Latenz und Abort verifizieren.

## LayoutStore-Vertrag

```ts
export interface NteDataTableLayoutSnapshot {
  version: 1;
  schemaKey: string;
  columns: Readonly<
    Record<
      NteDataTableColumnId,
      {
        width?: number;
        order?: number;
        pinned?: NteDataTablePin;
        hidden?: boolean;
      }
    >
  >;
}

export interface NteDataTableLayoutStoreContext {
  key: string;
  schemaKey: string;
  columnIds: readonly NteDataTableColumnId[];
}

export interface NteDataTableLayoutStore {
  load(
    context: Readonly<NteDataTableLayoutStoreContext>
  ): Promise<NteDataTableLayoutSnapshot | null>;

  save(
    context: Readonly<NteDataTableLayoutStoreContext>,
    snapshot: Readonly<NteDataTableLayoutSnapshot>
  ): Promise<void>;

  clear(
    context: Readonly<NteDataTableLayoutStoreContext>
  ): Promise<void>;
}

export class NteLocalStorageDataTableLayoutStore
  implements NteDataTableLayoutStore {
  constructor(options?: {
    storage?: Storage;
    namespace?: string;
  });
}
```

Default-Keyspace: `nte-data-table:<persistenceKey>`. Der Default-`schemaKey` ist eine versionspräfigierte, deterministische Codierung der sortierten Column-IDs. Der Store speichert ausschließlich JSON-fähigen Layout-State. Writes werden serialisiert; ein älterer Save darf keinen neueren Snapshot überschreiben.

Der Extensions-Skill enthält Contract Tests für Roundtrip, fehlende/entfernte Spalten, korrupte Payloads, parallele Saves, Schemawechsel und Storage-Fehler.

## Cell-Type-Registry

```ts
export interface NteDataTableCellType<
  Row extends object,
  Value = unknown
> {
  renderer?: NteDataTableCellRenderer<Row, Value>;
  editor?:
    | "text"
    | NteDataTableSelectEditor<Row, Value>
    | NteDataTableEditorFactory<Row, Value>;
  parse?: NteDataTableColumnBase<Row, Value>["parse"];
  validate?: NteDataTableColumnBase<Row, Value>["validate"];
  sortValue?: NteDataTableColumnBase<Row, Value>["sortValue"];
  compare?: NteDataTableColumnBase<Row, Value>["compare"];
  searchText?: NteDataTableColumnBase<Row, Value>["searchText"];
}

table.registerCellType("money", moneyCellType);
table.unregisterCellType("money");
```

Die Registrierung ist instanzlokal. Globale Registrierung kann später als separater Helper angeboten werden, gehört aber nicht zum Element-Lifecycle.

## Öffentliche Methoden

```ts
configure<Row extends object>(
  config: NteDataTableConfig<Row>
): Promise<void>;

getState<Row extends object>(): Readonly<NteDataTableState<Row>>;
getRows<Row extends object>(): readonly Row[];
setRows<Row extends object>(rows: readonly Row[]): Promise<void>;

reload(): Promise<void>;
setSearch(value: string): Promise<void>;
setSort(sort: readonly NteDataTableSort[]): Promise<void>;

setRowSelection(ids: readonly NteDataTableRowId[]): void;
setColumnSelection(ids: readonly NteDataTableColumnId[]): void;
activateCell(
  rowId: NteDataTableRowId,
  columnId: NteDataTableColumnId
): void;

resizeColumn(
  columnId: NteDataTableColumnId,
  width: number
): Promise<void>;
moveColumn(
  columnId: NteDataTableColumnId,
  targetIndexInZone: number
): Promise<void>;
pinColumn(
  columnId: NteDataTableColumnId,
  pin: NteDataTablePin | null
): Promise<void>;
resetColumnLayout(): Promise<void>;

startEdit(
  rowId: NteDataTableRowId,
  columnId: NteDataTableColumnId
): void;
commitEdit(): Promise<boolean>;
cancelEdit(): void;

moveRows(
  rowIds: readonly NteDataTableRowId[],
  beforeRowId: NteDataTableRowId | null
): Promise<boolean>;

scrollToRow(
  rowId: NteDataTableRowId,
  options?: { align?: "start" | "center" | "end" | "nearest" }
): Promise<boolean>;
```

Semantik:

- Async-Query-Methoden lösen erst auf, wenn der aktuelle Read abgeschlossen oder wegen einer neueren Query verworfen ist; echte Fehler werden nach dem Fehler-Event abgelehnt.
- Layout-Methoden lösen nach State-Änderung und gegebenenfalls abgeschlossenem Store-Write auf.
- `setRows()` ist nur im Array-Modus erlaubt und löst sonst mit `NteDataTableUsageError` ab.
- `getRows()` liefert im Connector-Modus nur die aktuell geladene Sicht.
- `commitEdit()` liefert `false`, wenn ein Cancel-Event oder Validation den Commit verhindert.
- `moveRows()` liefert `false`, wenn das Before-Event abgebrochen wurde.
- `scrollToRow()` findet in Phase 1 nur geladene Rows und liefert sonst `false`; ein Locate-Adapter folgt frühestens in Phase 3.
- Unbekannte IDs und ungültige Konfigurationen werfen typisierte Usage Errors.

Primitive Attribute werden vor `configure()` als Defaults gelesen; explizite Config-Werte gewinnen. Ein erneutes `configure()` validiert den Vertrag, beendet aktive Requests/Editoren, ersetzt den verwalteten State und lädt neu.

## Attribute und Properties

| Attribut | Property | Typ | Zweck |
| --- | --- | --- | --- |
| `interaction-mode` | `interactionMode` | `auto`, `table`, `grid` | Semantik und Tastaturmodell |
| `layout-mode` | `layoutMode` | `scroll`, `fit` | Breitenverteilung |
| `readonly` | `readOnly` | boolean | Editing und Mutationen sperren |
| `persistence-key` | `persistenceKey` | string | stabiler Store-Key |
| `persist-layout` | `persistLayout` | boolean | Layout-Speicherung aktivieren |
| `aria-label` | — | string | Fallback-Name für inneren semantischen Baum |

Komplexe Werte wie `columns`, `rows`, `connector`, `layoutStore`, Selection- und Editing-Konfiguration sind Properties beziehungsweise Teil von `configure()`, keine JSON-Attribute.

## Events

Alle Events sind `bubbles: true` und `composed: true`. Jedes Detail enthält `source: NteDataTableSource`.

| Event | Zeitpunkt und Detail |
| --- | --- |
| `nte-data-table-query-change` | direkt nach akzeptierter Query-Änderung, vor dem Read; `{ query }` |
| `nte-data-table-load-start` | Request gestartet; `{ query, requestId }` |
| `nte-data-table-load` | aktuelle Antwort übernommen; `{ query, requestId, rowCount, totalRowCount }` |
| `nte-data-table-error` | typisierter Fehler; `{ kind, error, recoverable }` |
| `nte-data-table-rows-change` | lokaler Array-Edit oder `setRows`; `{ rows, changes }` |
| `nte-data-table-selection-change` | Row-/Column-Auswahl übernommen; `{ selection }` |
| `nte-data-table-active-cell-change` | aktive Zelle geändert; `{ activeCell }` |
| `nte-data-table-cell-activate` | Zelle per Pointer/Keyboard aktiviert; `{ rowId, columnId }` |
| `nte-data-table-row-activate` | Zeile aktiviert; `{ rowId }` |
| `nte-data-table-layout-change` | Resize, Move, Pin, Restore oder Reset; `{ layout, reason }` |
| `nte-data-table-edit-start` | Editor geöffnet; `{ rowId, columnId, value }` |
| `nte-data-table-before-edit-commit` | vor Mutation, `cancelable: true`; `{ mutation }` |
| `nte-data-table-edit-commit` | Mutation bestätigt; `{ mutation, row }` |
| `nte-data-table-edit-error` | Validation-/Mutation-Fehler; `{ kind, mutation, error }` |
| `nte-data-table-before-row-reorder` | vor Move, `cancelable: true`; `{ rowIds, beforeRowId }` |
| `nte-data-table-row-reorder` | Connector/Array-Move erfolgreich; `{ rowIds, beforeRowId }` |
| `nte-data-table-row-reorder-error` | Move fehlgeschlagen; `{ rowIds, beforeRowId, error }` |

Fehler-`kind` ist mindestens:

```ts
type NteDataTableErrorKind =
  | "configuration"
  | "load"
  | "mutation"
  | "validation"
  | "layout-load"
  | "layout-save"
  | "layout-reset"
  | "reorder";
```

Abgebrochene Requests durch eine neuere Query sind kein User-Fehler und erzeugen standardmäßig kein Error-Event.

## Slots

```html
<nte-data-table
  id="issues"
  persistence-key="issues:v1"
  aria-label="Issues"
>
  <label slot="toolbar-start">
    Suche
    <input id="issues-search" type="search">
  </label>

  <output slot="footer-start" id="issues-count"></output>
  <button slot="footer-end" type="button">Mehr laden</button>
</nte-data-table>
```

```ts
const table = document.querySelector("nte-data-table");
const search = document.querySelector("#issues-search");
const count = document.querySelector("#issues-count");

search.addEventListener("input", event => {
  void table.setSearch(event.currentTarget.value);
});

table.addEventListener("nte-data-table-load", event => {
  count.value = String(event.detail.totalRowCount ?? event.detail.rowCount);
});
```

Slot-Namen: `caption`, `toolbar-start`, `toolbar-end`, `header-start`, `header-end`, `footer-start`, `footer-center`, `footer-end`, `loading`, `empty`, `error`.

## Beispiel: lokales editierbares Grid

```ts
const table = document.querySelector<NteDataTable>("nte-data-table");

await table.configure({
  rows: issues,
  getRowId: issue => issue.id,
  columns: [
    {
      id: "title",
      label: "Titel",
      field: "title",
      width: 320,
      minWidth: 160,
      pinned: "start",
      sortable: true,
      searchable: true,
      editable: true,
      editor: "text"
    },
    {
      id: "status",
      label: "Status",
      field: "status",
      width: 160,
      sortable: true,
      editable: true,
      editor: {
        type: "select",
        options: [
          { value: "open", label: "Offen" },
          { value: "done", label: "Erledigt" }
        ]
      }
    }
  ],
  selection: {
    rows: "multiple",
    columns: "single"
  },
  sorting: {
    mode: "multiple"
  },
  editing: {
    enabled: true,
    optimistic: true
  },
  persistenceKey: "issues:v1"
});
```

## Beispiel: eigener Connector

```ts
class IssuesConnector
  implements NteDataTableConnector<Issue> {
  readonly capabilities = {
    search: true,
    sorting: "multiple",
    rangeRead: false
  } as const;

  getRowId(issue: Readonly<Issue>) {
    return issue.id;
  }

  async read(query, { signal }) {
    const response = await fetch("/api/issues/query", {
      method: "POST",
      signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(query)
    });

    if (!response.ok) {
      throw new Error(`Issue query failed: ${response.status}`);
    }

    return response.json();
  }

  async updateCells(mutations, { signal }) {
    const response = await fetch("/api/issues/cells", {
      method: "PATCH",
      signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mutations })
    });

    if (!response.ok) {
      throw new Error(`Issue update failed: ${response.status}`);
    }

    return response.json();
  }
}
```

Das Extensions-Skill-Dokument erklärt zusätzlich Race Handling, Auth außerhalb des Connectors, LayoutStore-Migrationen, Cell-Type-Registrierung und die erforderlichen Contract Tests.
