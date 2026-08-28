# NTE Data Table – API-Anhang

**Status:** Proposed  
**Gehört zu:** [nte-data-table.md](./nte-data-table.md)

Dieser Anhang präzisiert die öffentliche TypeScript-, Attribut-, Methoden- und Event-API **nach Abschluss von Phase 1B**. Namen können im Review noch angepasst werden; Schichtengrenzen und Semantik sollen danach stabil bleiben. Phase-2-Funktionen wie Row Reordering, Visibility, Filter, Live Updates und Optimistic Editing werden hier absichtlich noch nicht als verfügbare Member definiert. Der optionale Range-Deskriptor ist allein die vorwärtskompatible Naht für Phase 3 und wird vorher nicht gesendet.

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
export type NteDataTableActivationMode = "none" | "cell" | "row" | "both";
export type NteDataTableLayoutMode = "scroll" | "fit";
```

Defaults:

| Option | Default |
| --- | --- |
| `interactionMode` | `"auto"` |
| `activation` | `"none"` |
| `layoutMode` | `"scroll"` |
| `readOnly` | `false` |
| Row-/Column-Selection | `"none"` |
| Sort mode | `"single"` |
| Editing | deaktiviert |
| Edit activation | `"double-click"` plus Keyboard `Enter`/`F2` |
| Edit commit | `"blur-or-enter"` |
| `width` / `minWidth` / `maxWidth` | `160` / `80` / `600` CSS px |
| `flex` | im `fit`-Modus `1`; explizites `0` fixiert die Basisbreite |
| `resizable` | `true` |
| `sortable`, `searchable`, `editable`, `reorderable` | `false` |
| `selectable` | `true`, sobald Column Selection aktiv ist; sonst ohne Wirkung |
| Query | `{ search: "", sort: [] }` |
| `locale` | `"en"` |
| Connector-Editing | pessimistisch |
| `cellType` | `"text"` |
| `pinned` | ungepinnt |
| Layout-Persistenz | nur mit explizitem Key/Opt-in |

`readonly` ist das boolesche HTML-Attribut; `readOnly` ist die entsprechende TypeScript-Property.

`interactionMode: "auto"` ist deterministisch: Der Modus wird `grid`, wenn `activation !== "none"`, Row-/Column-Selection nicht `"none"` oder Editing effektiv aktiviert ist. `readOnly` macht Editing effektiv inaktiv. In allen anderen Fällen bleibt der Modus `table`. Ein explizites `interactionMode: "table"` zusammen mit Activation, Selection oder effektivem Editing ist ein `NteDataTableUsageError`; die Komponente normalisiert diesen Konflikt nicht still.

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

export interface NteDataTableColumnBase<
  Row extends object,
  Value = unknown
> {
  id: NteDataTableColumnId;
  label: string;
  ariaLabel?: string;
  queryKey?: string;
  mutationKey?: string;

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

export type NteDataTableFieldColumn<Row extends object> = {
  [Key in Extract<keyof Row, string>]-?:
    NteDataTableColumnBase<Row, Row[Key]> & {
      field: Key;
      value?: never;
      setValue?: (
        row: Readonly<Row>,
        value: Row[Key]
      ) => Row | Promise<Row>;
    };
}[Extract<keyof Row, string>];

export type NteDataTableComputedColumn<
  Row extends object,
  Value = unknown
> = NteDataTableColumnBase<Row, Value> & {
  field?: never;
  value: (row: Readonly<Row>) => Value;
  setValue?: (
    row: Readonly<Row>,
    value: Value
  ) => Row | Promise<Row>;
};

export type NteDataTableColumn<
  Row extends object,
  ComputedValue = unknown
> =
  | NteDataTableFieldColumn<Row>
  | NteDataTableComputedColumn<Row, ComputedValue>;
```

Regeln:

- Im Array-Modus ist ein berechneter Accessor nur editierbar, wenn `setValue()` eine Ersatzzeile liefert.
- Im Connector-Modus benötigt ein berechneter Accessor stattdessen einen expliziten `mutationKey` und der Connector `updateCells()`.
- Bei einem `field` ohne `setValue()` erzeugt der Array-Modus selbst eine flache Ersatzzeile.
- Explizite Column-Hooks überschreiben nur die gleichnamige Funktion des Cell Types.
- Nicht überschriebene Renderer-, Editor-, Parse-, Validate-, Sort- und Search-Hooks kommen weiterhin aus dem Cell Type.
- Renderer-Strings sind Text, niemals HTML.
- `queryKey` wird als `column.queryKey`, dann String-`field`, dann `column.id` aufgelöst.
- `mutationKey` ist davon unabhängig: Feldname als Default; bei berechneten Connector-Spalten explizit erforderlich.
- Aktiviert die Tabelle Column Selection, ist `selectable` effektiv `true`; einzelne Spalten können mit `false` ausgeschlossen werden.
- Breiten werden auf ganze, endliche CSS-Pixel und den Min-/Max-Bereich normalisiert.
- `flex` ist eine endliche, nichtnegative Zahl.

### Deterministischer `fit`-Algorithmus

`width` ist die Basisbreite. Sichtbare Spalten ohne explizites `flex` verwenden in `fit` den Wert `1`; `flex: 0` hält die Basisbreite. Freie Breite oder Defizit wird proportional zu positivem Flex verteilt und iterativ an Min/Max geklemmt. Unterhalb der Summe aller Minima entsteht Overflow; oberhalb der Summe aller Maxima bleibt End-Freiraum.

Resize und LayoutStore ändern ausschließlich die Basisbreite. Die aus Viewport und Flex berechnete effektive Breite wird weder in `state.layout.widths` noch im Store persistiert und nach jedem Viewportwechsel neu berechnet.

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
}

export interface NteDataTableSortingConfig {
  mode?: "single" | "multiple";
}

interface NteDataTableBaseConfig<Row extends object> {
  columns: readonly NteDataTableColumn<Row>[];

  interactionMode?: NteDataTableInteractionMode;
  activation?: NteDataTableActivationMode;
  layoutMode?: NteDataTableLayoutMode;
  readOnly?: boolean;
  locale?: string;

  selection?: NteDataTableSelectionConfig;
  editing?: NteDataTableEditingConfig;
  sorting?: NteDataTableSortingConfig;

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

`configure()` kopiert das Array, aber nicht vorsorglich jedes Objekt tief. Der Array-Modus hält den vollständigen kanonischen `sourceRows`-Bestand getrennt von der gefilterten/sortierten View. Erst eine Änderung ersetzt die betroffene Zeile und das Array. Container sind readonly; Row-Objekte gelten immutable-by-contract und werden nicht tief geklont oder eingefroren. In Connector-Modus sind die geladenen Rows Snapshots der autoritativen Quelle.

Persistenz folgt exakt dieser Priorität:

| Bedingung | Ergebnis |
| --- | --- |
| `layoutStore: null` oder `persistLayout: false` | aus |
| sonst nichtleerer `persistenceKey` | an |
| sonst `persistLayout: true` plus nichtleere Host-`id` | an |
| sonst | aus |

`effectiveKey = (persistenceKey ?? "").trim() || host.id.trim()`. `persistLayout: true` ohne effektiven Key erzeugt ein recoverable Konfigurations-Event, aber keinen Load/Write. Ein eigener Store allein aktiviert Persistenz nicht.

Row-IDs müssen eindeutig und über Search, Sort und Reload stabil sein. Duplikate erzeugen im Array-Modus einen Usage Error und in Connector-Reads einen Load Error. Search, Sort und Reload erhalten Selection per ID. Wenn die aktive Row nicht mehr sichtbar ist, wird `focus.activeCell` gelöscht. `setRows()` entfernt Selection-IDs, die im neuen kanonischen Bestand fehlen; gefilterte Rows bleiben selektiert. Connector-Selection darf ungeladene stabile IDs halten.

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
  rowAnchorId?: NteDataTableRowId;
  columnAnchorId?: NteDataTableColumnId;
}

export interface NteDataTableFocusState {
  activeCell?: {
    rowId: NteDataTableRowId;
    columnId: NteDataTableColumnId;
  };
}

export interface NteDataTableLayoutState {
  order: readonly NteDataTableColumnId[];
  widths: Readonly<Record<NteDataTableColumnId, number>>;
  pinned: Readonly<
    Partial<Record<NteDataTableColumnId, NteDataTablePin>>
  >;
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
  focus: Readonly<NteDataTableFocusState>;
  layout: Readonly<NteDataTableLayoutState>;
  edit?: Readonly<NteDataTableEditState>;
  data: Readonly<{
    rows: readonly Readonly<Row>[];
    status: "idle" | "loading" | "ready" | "error";
    totalRowCount: number | null;
    loadedStart: number;
    requestId: number;
    error?: unknown;
  }>;
}
```

`getState()` gibt readonly Container zurück; Row-Objekte bleiben immutable-by-contract. `state.data.rows` ist die aktuelle Query-View beziehungsweise die geladene Connector-View, nicht der kanonische Array-Bestand. Reine Fokusnavigation löst kein Selection-Change-Event aus. `totalRowCount: null` bedeutet unbekannt und wird im Grid als `aria-rowcount="-1"` ausgegeben.

## Connector-Vertrag

Der Connector kennt keine DOM- oder UI-Spaltendefinition. Er erhält DOM-freie, aufgelöste Query-/Mutationsdaten; `AbortSignal` ist separater Out-of-band-Kontext. Row- und Cell-Werte bleiben anwendungsdefiniert und müssen nicht JSON-fähig sein. Der Connector verantwortet eine notwendige Wire-Codierung.

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
  rows: readonly Readonly<Row>[];
  start: number;
  totalRowCount: number | null;
}

export interface NteDataTableCellMutation {
  rowId: NteDataTableRowId;
  columnId: NteDataTableColumnId;
  mutationKey: string;
  previousValue: unknown;
  value: unknown;
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
    updatedRows?: readonly Readonly<Row>[];
  }>;
}
```

MVP-Regeln:

- `read()` ist Pflicht und muss `AbortSignal` beachten.
- Fehlende Capabilities bedeuten `search: false`, `sorting: "none"` und `rangeRead: false`.
- Die Komponentenoption bestimmt, ob eine Funktion sichtbar/bedienbar ist; Capabilities bestimmen, ob die Datenquelle sie ausführen kann. Beides muss passen.
- Das Vorhandensein von `updateCells()` ist die Phase-1B-Mutation-Capability.
- `updateCells()` mit `updatedRows` patcht anhand stabiler Row-ID. Ohne `updatedRows` lädt die Tabelle den aktuellen Bereich neu.
- `mutationKey` ist nie automatisch der `queryKey`; sortierbare Ausdrücke und schreibbare Felder dürfen verschieden sein.
- Phase 1 liest den vollständigen Datensatz und lässt `range` weg. Phase 3 verwendet Offset/Size; Cursor-Pagination ist nicht Teil dieses Vertrags.
- Filter und Live-Subscription sind bewusst nicht untypisiert im MVP. Phase 2 ergänzt eigenständige, typisierte Erweiterungsverträge.
- Eine Antwort einer älteren `requestId` darf den aktuellen State nicht überschreiben.

### Lokale Array-Verarbeitung

Der direkte `rows`-Modus läuft im Controller der Tabelle. Dadurch bleiben Accessor-, Cell-Type-, Sort- und Search-Hooks in der UI-/State-Schicht und werden nicht in einen Connector geleakt. Es gibt in Phase 1 keinen öffentlichen `NteArrayDataTableConnector`.

Der interne Array-Pfad kopiert die Eingabesequenz, mutiert Caller-Zeilen nicht und verwendet Ersatzzeilen für Updates. Ohne Column-/Cell-Type-Override gelten folgende Contract-Test-Regeln:

- leere Suche wird als Connector-`search: null` beziehungsweise lokal als ungefilterte View behandelt;
- Suche ist NFKC-normalisierte, case-insensitive Substring-Suche über `searchText`;
- Textsortierung verwendet `Intl.Collator(locale, { numeric: false, sensitivity: "base" })`;
- `locale` ist standardmäßig `"en"` und konfigurierbar;
- Zahlen bleiben numerisch, numerische Strings bleiben Text;
- `null` und `undefined` stehen in beiden Sortierrichtungen zuletzt;
- gleiche Vergleichswerte behalten ihre Source-Reihenfolge.

Dieselbe interne Engine wird durch Contract Tests mit künstlicher Latenz und Abort-Szenarien geprüft.

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
    context: Readonly<NteDataTableLayoutStoreContext>,
    options: { signal: AbortSignal }
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

  load(
    context: Readonly<NteDataTableLayoutStoreContext>,
    options: { signal: AbortSignal }
  ): Promise<NteDataTableLayoutSnapshot | null>;

  save(
    context: Readonly<NteDataTableLayoutStoreContext>,
    snapshot: Readonly<NteDataTableLayoutSnapshot>
  ): Promise<void>;

  clear(
    context: Readonly<NteDataTableLayoutStoreContext>
  ): Promise<void>;
}
```

Default-Keyspace: `nte-data-table:<effectiveKey>`. Der Default-`schemaKey` ist eine versionspräfigierte, deterministische Codierung der sortierten Column-IDs. Der Store speichert ausschließlich JSON-fähigen Layout-State. `load()` beachtet das `AbortSignal`; die Komponente verwirft zusätzlich verspätete Ergebnisse eines alten Store-Kontexts. Writes werden serialisiert; ein älterer Save darf keinen neueren Snapshot überschreiben.

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

Die Registrierung ist instanzlokal und überlebt ein erneutes `configure()`. Ein bereits belegter Name wirft ohne `{ replace: true }` einen Usage Error. `unregisterCellType()` liefert bei unbekanntem Namen `false`; reservierte Built-ins können nicht entfernt werden. Globale Registrierung kann später als separater Helper angeboten werden, gehört aber nicht zum Element-Lifecycle.

## Öffentliche Errors

```ts
export type NteDataTableUsageErrorCode =
  | "invalid-config"
  | "mode-conflict"
  | "unknown-column"
  | "row-not-loaded"
  | "duplicate-row-id"
  | "selection-cardinality"
  | "unsupported-operation";

export class NteDataTableUsageError extends TypeError {
  readonly code: NteDataTableUsageErrorCode;
  constructor(
    code: NteDataTableUsageErrorCode,
    message: string,
    options?: { cause?: unknown }
  );
}

export type NteDataTableCapabilityErrorCode =
  | "search"
  | "sorting"
  | "update-cells"
  | "range-read";

export class NteDataTableCapabilityError extends Error {
  readonly code: NteDataTableCapabilityErrorCode;
  constructor(
    code: NteDataTableCapabilityErrorCode,
    message: string,
    options?: { cause?: unknown }
  );
}
```

## Öffentliche Methoden

```ts
export class NteDataTable<
  Row extends object = Record<string, unknown>
> extends HTMLElement {
  interactionMode: NteDataTableInteractionMode;
  activation: NteDataTableActivationMode;
  layoutMode: NteDataTableLayoutMode;
  readOnly: boolean;
  persistenceKey: string;
  persistLayout: boolean;

  configure(config: NteDataTableConfig<Row>): Promise<void>;

  getState(): Readonly<NteDataTableState<Row>>;
  getRows(): readonly Readonly<Row>[];
  getVisibleRows(): readonly Readonly<Row>[];
  setRows(rows: readonly Readonly<Row>[]): Promise<void>;

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

  scrollToRow(
    rowId: NteDataTableRowId,
    options?: {
      align?: "start" | "center" | "end" | "nearest";
    }
  ): Promise<boolean>;

  registerCellType<Value = unknown>(
    name: string,
    definition: NteDataTableCellType<Row, Value>,
    options?: { replace?: boolean }
  ): void;
  unregisterCellType(name: string): boolean;

  addEventListener<K extends keyof NteDataTableEventMap<Row>>(
    type: K,
    listener: (
      this: NteDataTable<Row>,
      event: NteDataTableEventMap<Row>[K]
    ) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof NteDataTableEventMap<Row>>(
    type: K,
    listener: (
      this: NteDataTable<Row>,
      event: NteDataTableEventMap<Row>[K]
    ) => void,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject | null,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "nte-data-table": NteDataTable<Record<string, unknown>>;
  }
}
```

Semantik:

- Async-Query-Methoden lösen erst auf, wenn der aktuelle Read abgeschlossen oder wegen einer neueren Query verworfen ist; echte Fehler werden nach dem Fehler-Event abgelehnt.
- Layout-Methoden lösen nach State-Änderung und gegebenenfalls abgeschlossenem Store-Write auf.
- `setRows()` ist nur im Array-Modus erlaubt, ersetzt den vollständigen `sourceRows`-Bestand und löst sonst mit `NteDataTableUsageError` ab.
- `getRows()` liefert im Array-Modus den vollständigen kanonischen Bestand, im Connector-Modus die aktuell geladene Sicht.
- `getVisibleRows()` liefert in beiden Modi die aktuelle Query-/Connector-View.
- `commitEdit()` liefert `false`, wenn ein Cancel-Event oder Validation den Commit verhindert.
- `scrollToRow()` findet in Phase 1 nur geladene Rows und liefert sonst `false`; ein Locate-Adapter folgt frühestens in Phase 3.
- Programmatic Calls normalisieren Konflikte nicht still: mehrere Sorts im Single-Modus, Search/Sort gegen fehlende Connector-Capability, mehrere IDs im Single-Selection-Modus und Resize/Move auf nicht freigegebenen Spalten werfen einen typisierten Usage- beziehungsweise Capability-Error.
- Column IDs müssen existieren. Edit und Activation benötigen eine geladene Row. Row Selection darf im Connector-Modus auch ungeladene stabile IDs halten; `scrollToRow()` liefert für ungeladene Rows wie beschrieben `false`.
- Nicht verfügbare Pointer-/Keyboard-Gesten werden gar nicht angeboten.

Der Row-Typ ist an die Elementinstanz gebunden, beispielsweise `NteDataTable<Issue>`; Methoden sind nicht unabhängig generisch. Das rohe Tag-Name-Mapping verwendet `Record<string, unknown>`, während Anwendungen ihre bekannte Row-Form beim Query beziehungsweise bei einer typisierten Factory angeben.

Primitive Attribute und ihre gleichnamigen Properties werden vor `configure()` als Defaults gelesen; explizite Config-Werte gewinnen. Nach `configure()` bleiben die in der Klasse deklarierten primitiven Properties beziehungsweise Attribute reaktiv:

- `interactionMode`, `activation` und `layoutMode` validieren und rendern synchron neu;
- `readOnly: true` bricht einen offenen Editor ab; ein späteres `false` wird gegen den aktuellen Interaction-Mode validiert;
- `persistenceKey` und `persistLayout` wechseln den effektiven Store-Kontext, brechen einen laufenden Layout-Load ab und restaurieren asynchron; Abschluss und Fehler werden über Layout-/Error-Events gemeldet;
- eine ungültige Property-Änderung wird verworfen und wirft einen Usage Error; eine ungültige Attributänderung wird auf den letzten gültigen Wert zurückgesetzt und meldet ein recoverable Konfigurations-Event.

`columns`, `rows`, `connector` und Stores werden in Phase 1 ausschließlich atomar über `configure()` gesetzt, nicht über voneinander unabhängige Property-Setter. Ein erneutes `configure()` validiert den Vertrag, beendet aktive Requests/Editoren, ersetzt den verwalteten State und lädt neu.

## Attribute und Properties

| Attribut | Property | Typ | Zweck |
| --- | --- | --- | --- |
| `interaction-mode` | `interactionMode` | `auto`, `table`, `grid` | Semantik und Tastaturmodell |
| — | `activation` | `none`, `cell`, `row`, `both` | explizite Aktivierungs-Events und Auto-Grid-Auslöser |
| `layout-mode` | `layoutMode` | `scroll`, `fit` | Breitenverteilung |
| `readonly` | `readOnly` | boolean | Daten-Edits sperren; Query, Selection und Column-Layout bleiben aktiv |
| `persistence-key` | `persistenceKey` | string | stabiler Store-Key |
| `persist-layout` | `persistLayout` | boolean | Layout-Speicherung aktivieren |
| `aria-label` | — | string | Fallback-Name für inneren semantischen Baum |

Komplexe Werte wie `columns`, `rows`, `connector`, `layoutStore`, Selection- und Editing-Konfiguration sind Konfigurationsfelder von `configure()`, keine unabhängigen Properties und keine JSON-Attribute.

## TypeScript-Event-Vertrag

```ts
export interface NteDataTableBaseEventDetail {
  source: NteDataTableSource;
}

export type NteDataTableErrorKind =
  | "configuration"
  | "capability"
  | "load"
  | "mutation"
  | "validation"
  | "layout-load"
  | "layout-save"
  | "layout-reset";

export interface NteDataTableEventMap<Row extends object> {
  "nte-data-table-query-change": CustomEvent<
    NteDataTableBaseEventDetail & {
      query: Readonly<NteDataTableQueryState>;
    }
  >;
  "nte-data-table-load-start": CustomEvent<
    NteDataTableBaseEventDetail & {
      query: Readonly<NteDataTableQueryState>;
      requestId: number;
    }
  >;
  "nte-data-table-load": CustomEvent<
    NteDataTableBaseEventDetail & {
      query: Readonly<NteDataTableQueryState>;
      requestId: number;
      rowCount: number;
      totalRowCount: number | null;
    }
  >;
  "nte-data-table-error": CustomEvent<
    NteDataTableBaseEventDetail & {
      kind: NteDataTableErrorKind;
      error: unknown;
      recoverable: boolean;
    }
  >;
  "nte-data-table-rows-change": CustomEvent<
    NteDataTableBaseEventDetail & {
      rows: readonly Readonly<Row>[];
      changes: readonly NteDataTableCellMutation[];
    }
  >;
  "nte-data-table-selection-change": CustomEvent<
    NteDataTableBaseEventDetail & {
      selection: Readonly<NteDataTableSelectionState>;
    }
  >;
  "nte-data-table-active-cell-change": CustomEvent<
    NteDataTableBaseEventDetail & {
      activeCell: NteDataTableFocusState["activeCell"];
    }
  >;
  "nte-data-table-cell-activate": CustomEvent<
    NteDataTableBaseEventDetail & {
      rowId: NteDataTableRowId;
      columnId: NteDataTableColumnId;
    }
  >;
  "nte-data-table-row-activate": CustomEvent<
    NteDataTableBaseEventDetail & {
      rowId: NteDataTableRowId;
    }
  >;
  "nte-data-table-layout-change": CustomEvent<
    NteDataTableBaseEventDetail & {
      layout: Readonly<NteDataTableLayoutState>;
      reason: "resize" | "move" | "pin" | "restore" | "reset";
    }
  >;
  "nte-data-table-edit-start": CustomEvent<
    NteDataTableBaseEventDetail & {
      rowId: NteDataTableRowId;
      columnId: NteDataTableColumnId;
      value: unknown;
    }
  >;
  "nte-data-table-before-edit-commit": CustomEvent<
    NteDataTableBaseEventDetail & {
      mutation: Readonly<NteDataTableCellMutation>;
    }
  >;
  "nte-data-table-edit-commit": CustomEvent<
    NteDataTableBaseEventDetail & {
      mutation: Readonly<NteDataTableCellMutation>;
      row?: Readonly<Row>;
    }
  >;
  "nte-data-table-edit-error": CustomEvent<
    NteDataTableBaseEventDetail & {
      kind: "validation" | "mutation";
      mutation: Readonly<NteDataTableCellMutation>;
      error: unknown;
    }
  >;
}
```

## Events

Alle Events sind `bubbles: true` und `composed: true`. Jedes Detail enthält `source: NteDataTableSource`; `nte-data-table-before-edit-commit` ist zusätzlich `cancelable: true`.

| Event | Zeitpunkt und Detail |
| --- | --- |
| `nte-data-table-query-change` | direkt nach akzeptierter Query-Änderung, vor dem Read; `{ query }` |
| `nte-data-table-load-start` | Request gestartet; `{ query, requestId }` |
| `nte-data-table-load` | aktuelle Antwort übernommen; `{ query, requestId, rowCount, totalRowCount }` |
| `nte-data-table-error` | typisierter Fehler; `{ kind, error, recoverable }` |
| `nte-data-table-rows-change` | lokaler Array-Edit oder `setRows`; `{ rows, changes }`, wobei `rows` der vollständige kanonische Bestand ist |
| `nte-data-table-selection-change` | Row-/Column-Auswahl übernommen; `{ selection }` |
| `nte-data-table-active-cell-change` | aktive Zelle geändert; `{ activeCell }` |
| `nte-data-table-cell-activate` | Zelle per Pointer/Keyboard aktiviert; `{ rowId, columnId }` |
| `nte-data-table-row-activate` | Zeile aktiviert; `{ rowId }` |
| `nte-data-table-layout-change` | Resize, Move, Pin, Restore oder Reset; `{ layout, reason }` |
| `nte-data-table-edit-start` | Editor geöffnet; `{ rowId, columnId, value }` |
| `nte-data-table-before-edit-commit` | vor Mutation, `cancelable: true`; `{ mutation }` |
| `nte-data-table-edit-commit` | Mutation bestätigt; `{ mutation, row? }`, da die Row nach Reload außerhalb der Query liegen kann |
| `nte-data-table-edit-error` | Validation-/Mutation-Fehler; `{ kind, mutation, error }` |

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
const table = document.querySelector<
  NteDataTable<Record<string, unknown>>
>("nte-data-table");
const search = document.querySelector<HTMLInputElement>("#issues-search");
const count = document.querySelector<HTMLOutputElement>("#issues-count");

if (!table || !search || !count) {
  throw new Error("Data-table example markup is incomplete");
}

search.addEventListener("input", () => {
  void table.setSearch(search.value);
});

table.addEventListener("nte-data-table-load", event => {
  count.value = String(
    event.detail.totalRowCount ?? event.detail.rowCount
  );
});
```

Slot-Namen: `caption`, `toolbar-start`, `toolbar-end`, `header-start`, `header-end`, `footer-start`, `footer-center`, `footer-end`, `loading`, `empty`, `error`.

## Beispiel: lokales editierbares Grid

```ts
const table =
  document.querySelector<NteDataTable<Issue>>("nte-data-table");

if (!table) {
  throw new Error("Missing nte-data-table");
}

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
    enabled: true
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

Remote-Commits sind in Phase 1B pessimistisch: Nach `nte-data-table-before-edit-commit` und erfolgreicher Validation wechselt der Editor auf `saving`, der bestätigte Row-State bleibt unverändert. Die Mutation verwendet `mutationKey`, nicht `queryKey`. Erst `updatedRows` oder der anschließende Reload aktualisiert die Row und löst `nte-data-table-edit-commit` aus. Bei Fehler folgt `nte-data-table-edit-error`, der Editor behält den Draft. Der direkte Array-Modus ersetzt die Row sofort nach Validation und emittiert zuerst `nte-data-table-rows-change`, dann `nte-data-table-edit-commit`.

Das Extensions-Skill-Dokument erklärt zusätzlich Race Handling, Auth außerhalb des Connectors, LayoutStore-Migrationen, Cell-Type-Registrierung und die erforderlichen Contract Tests.
