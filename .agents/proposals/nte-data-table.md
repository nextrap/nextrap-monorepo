# Proposal: NTE Data Table

**Status:** Draft zur fachlichen und technischen Review  
**Zielpaket:** `nextrap-elements/nte-data-table` / `@nextrap/nte-data-table` / `<nte-data-table>`  
**Vorgeschichte:** [Issue #26](https://github.com/nextrap/nextrap-monorepo/issues/26), [PR #48](https://github.com/nextrap/nextrap-monorepo/pull/48)

## Entscheidung in Kurzform

`nte-data-table` soll eine Nextrap-native, schema- und datengetriebene Data-Grid-Komponente für Single-Page Applications werden. Der Schwerpunkt liegt zunächst auf einer gut bedienbaren Datentabelle: Daten darstellen, Zellen beziehungsweise Zeilen aktivieren, suchen, sortieren, auswählen und optional editieren.

Empfohlen wird:

- ein DOM-basierter Renderer mit genau einem semantischen Tabellen-/Grid-Baum;
- ein paketunabhängiger öffentlicher API-Vertrag, der keine Typen einer Fremdbibliothek preisgibt;
- eine klare Trennung zwischen Daten-Connector, Tabellen-State, Layout-Persistenz und Zelltypen;
- `NteArrayDataTableConnector` und `NteLocalStorageDataTableLayoutStore` als Defaults;
- Text- und Select-Editing im MVP, alle weiteren Editoren über dieselbe Extension-API;
- ein fester oberer Bereich, ein scrollender Viewport und ein fester Footer;
- kein Column-Menü und keine Untermenüs;
- Row-Virtualisierung erst nach einem funktionsfähigen, vermessenen DOM-MVP.

Der alte PR #48 bleibt als UI- und Anforderungs-Spike wertvoll, soll aber technisch nicht fortgeführt werden. Er wird durch dieses Proposal konzeptionell ersetzt, jedoch nicht automatisch geschlossen.

## Ziele

- Tabellenartige Daten in einer SPA mit stabilen Zeilen- und Spalten-IDs darstellen.
- Spaltenbreiten konfigurieren, per Pointer und Tastatur ändern und persistent speichern.
- Vertikales und optional horizontales Scrollen mit festem Spaltenheader und festem Footer.
- Spalten logisch an `start` oder `end` anheften; keine hardcodierte Links-/Rechts-Logik.
- Einzel- und Mehrfachauswahl von Zeilen und Spalten.
- Sortierung nach einer oder mehreren Spalten.
- Suche über externes UI im Toolbar-Slot und einen kontrollierten Search-State.
- Optionales Inline-Editing pro Spalte, zunächst Text und Select.
- Austauschbare Connectoren für lokale Arrays und spätere Remote-/Lazy-Datenquellen.
- Austauschbare Persistenz für Layoutdaten, standardmäßig `localStorage`.
- Erweiterbare Renderer, Editoren und Validatoren.
- Themeing über Parts, Mixins und Nextrap-Tokens.
- Keyboard- und Screenreader-Bedienung von Anfang an.

## Non-Goals

Nicht Bestandteil des initialen Cores sind:

- Column-Menüs, Kontextmenüs oder verschachtelte Untermenüs;
- Pivoting, Formeln, Charts oder ein vollständiger Excel-Klon;
- Tree Data, Master/Detail und verschachtelte Tabellen;
- automatische responsive Kartenansichten;
- Canvas-Rendering;
- ein bestimmtes REST-, GraphQL- oder Datenbankprotokoll;
- kollaboratives Echtzeit-Editing;
- Export nach Excel/PDF im MVP.

Filter können später über einen kontrollierten State und externe UI ergänzt werden. Dafür muss kein eingebautes Column-Menü entstehen.

## Markt- und Open-Source-Vergleich

Stand der Recherche: 28. August 2026. Die Produkte dienen als Funktions- und Architekturvergleich, nicht automatisch als Abhängigkeit.

| Referenz | Typischer Einsatz und Umfang | Relevanz für NTE |
|---|---|---|
| [TanStack Table](https://tanstack.com/table/latest/docs/overview) | MIT-lizenzierter, headless Table-State mit offizieller [Lit-Integration](https://tanstack.com/table/latest/docs/framework/lit). Enthält unter anderem Sortierung, Selection, Sizing, Ordering und Pinning; Editing, Fetching und Rendering bleiben in der Anwendung. | Beste Referenz für einen kontrollierten, rendererunabhängigen State. Realistische interne Engine-Alternative, falls eine zusätzliche Dependency zugelassen wird. |
| [Tabulator](https://www.tabulator.info/) | Vollständiges MIT-Grid mit Virtual DOM, Editoren, Remote-Daten, Range-/Row-/Column-Selection, Frozen Columns und erweiterbarer [Persistence](https://www.tabulator.info/docs/6.x/persist). | Nächstes vollständiges OSS-Funktionsvorbild. Als Wrapper schnell, aber mit eigenem Renderer, Stylingmodell und großer API-Oberfläche. |
| [RevoGrid](https://rv-grid.com/guide/) | MIT-Core als Web Component mit Virtualisierung, Editing, Selection, Pinning und Plugin-System; zusätzliche Funktionen werden als Pro angeboten. Die Doku beschreibt [versionierte State-Persistenz](https://rv-grid.com/guide/state-persistence). | Technisch nächster fertiger Web-Component-Kandidat. Vor einer Übernahme müssten Pro-Grenzen, Attribution, verschachteltes Themeing und API-Lock-in geprüft werden. |
| [AG Grid](https://www.ag-grid.com/javascript-data-grid/community-vs-enterprise/) | Sehr vollständiges Enterprise-Grid. Community ist MIT; fortgeschrittene Server-, Range- und Analysefunktionen liegen teilweise in der kommerziellen Edition. Mehrere [Row Models](https://www.ag-grid.com/javascript-data-grid/row-models/) trennen lokale und serverseitige Daten. | Gutes Connector- und Capability-Vorbild, aber keine geeignete öffentliche NTE-Abhängigkeit. |
| [Handsontable](https://handsontable.com/) | DOM-basiertes Spreadsheet-Grid mit Editoren, Validatoren, Clipboard, Frozen Rows/Columns und Virtualisierung. Kommerzielle Produktion benötigt eine [bezahlte Lizenz](https://handsontable.com/docs/javascript-data-grid/software-license/). | Beste Spreadsheet-UX-Referenz, aber für den Nextrap-Core zu schwer und lizenzseitig ungeeignet. |
| [Glide Data Grid](https://github.com/glideapps/glide-data-grid) | MIT, React und Canvas; optimiert für Millionen Zeilen und schnelles Scrolling. Datenmutation, Sortierung und Filterung bleiben weitgehend beim Host. | Performance-Gegenpol. Canvas würde Nextrap-Parts, DOM-Zellkomponenten und Accessibility erschweren und ist deshalb nicht für den MVP empfohlen. |
| [MUI X Data Grid](https://mui.com/x/react-data-grid/) | React-/Material-Grid mit Community-, Pro- und Premium-Stufen. Der [Data-Source-Vertrag](https://mui.com/x/react-data-grid/server-side-data/) kapselt serverseitige Reads und Updates. | Bestätigt die Trennung von lokalem/remote Datenmodell und View-State; als React-/Lizenz-gebundene Basis ungeeignet. |
| [Airtable Grid View](https://support.airtable.com/articles/7905594155-airtable-grid-view) und [GitHub Projects Table](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-table-layout) | Geschlossene Produkte mit typisierten Feldern, direktem Editing, gespeicherten Views, Sortierung, Filterung, Spaltenbreite/-sichtbarkeit und Pinning. | UX-Vorbilder. Wichtigste Lehre: Schema, Daten und persistierter View-/Layout-State sind drei verschiedene Dinge. |

## Umsetzungsalternativen

| Alternative | Vorteile | Nachteile | Bewertung |
|---|---|---|---|
| A. Nextrap-nativer DOM-Core | Volle Kontrolle über API, Parts, A11y, Bundle und Release-Zyklus; keine neue Dependency; exakt auf den Scope begrenzbar. | Größter eigener Implementierungs- und Testaufwand, insbesondere bei Range-Selection und Virtualisierung. | **Empfehlung für das MVP.** |
| B. TanStack Table intern | Headless, MIT, Lit-Integration und ausgereifte State-Modelle; NTE behält Renderer und Styling. | Neue Dependency entgegen dem heutigen dependency-armen Repo-Contract; Connector, Editing und A11y bleiben eigene Arbeit. | Beste Alternative, falls eine Dependency ausdrücklich freigegeben wird. |
| C. NTE-Wrapper um RevoGrid Community | Schnellster Weg zu Virtualisierung und spreadsheetartiger Interaktion; bereits eine Web Component. | Open-Core-/Pro-Grenzen, Attribution, doppelte Komponenten-/Theme-Schicht und Fremd-API-Lock-in. | Sinnvoll, wenn Time-to-Market wichtiger als vollständige Nextrap-Kontrolle ist. |
| D. Wrapper um Tabulator oder AG Grid | Sehr schneller großer Funktionsumfang. | Renderer-, Styling- und Eventmodell passen schlecht zum Nextrap-Contract; AG Grid hat zusätzliche Lizenzgrenzen. | Für das Hauptpaket nicht empfohlen. |

Unabhängig von der gewählten internen Engine bleiben alle öffentlichen NTE-Typen eigenständig. Fremdtypen dürfen nicht in `columns`, Connectoren, Events oder Skills auftauchen. Damit kann die interne Engine später geändert werden.

## Empfohlene Architektur

| Schicht | Verantwortung |
|---|---|
| `NteDataTable` | Öffentliche Properties, Slots, Methoden und Events; verbindet alle Schichten. |
| State/Controller | Query, Auswahl, Fokus, Layout, Editing und Ladezustand; verarbeitet Commands deterministisch. |
| `NteDataTableConnector<Row>` | Liest und mutiert fachliche Daten; kennt keinen DOM- oder Layout-State. |
| `NteDataTableLayoutStore` | Lädt und speichert ausschließlich Layout-/View-Konfiguration. |
| Cell-Type Registry | Renderer, Editor, Parser, Validator und Clipboard-Serialisierung je Zelltyp. |
| DOM Renderer | Semantisches Markup, Sticky Header, gepinnte Spalten, Scrollen, Fokus und Tastatur. |

Connector-Antworten werden über `AbortSignal` abgebrochen und zusätzlich mit einer Request-ID gegen verspätete Antworten abgesichert.

## Rendering und Scroll-Modell

Der Host besteht funktional aus drei vertikalen Bereichen:

1. einer optionalen festen Toolbar;
2. einem `minmax(0, 1fr)`-Viewport als einzigem horizontalen und vertikalen Scrollport;
3. einem festen Footer.

Im Viewport liegt genau eine Tabelle mit `colgroup`, `thead` und `tbody`. Header und angeheftete Spalten werden innerhalb dieses Scrollports mit `position: sticky` umgesetzt. Header und Body werden nicht in getrennte Tabellen kopiert, weil dies die semantische Header-Zell-Beziehung und die synchrone Spaltenbreite unnötig erschwert. Für eine native Tabelle ist ein einzelner Baum mit sticky `th` auch die empfohlene Accessibility-Grundlage; siehe [Stanford Accessibility: Sticky Table Header](https://uit.stanford.edu/accessibility/techniques/websites/website-tables/table-sticky).

Spaltenbreiten werden über `colgroup` beziehungsweise zentrale Grid-Tracks aktualisiert, nicht wie in PR #48 an jeder einzelnen Zelle. Logische Pins verwenden `inset-inline-start` und `inset-inline-end`.

Zwei Layout-Modi bleiben konfigurierbar:

- `scroll` (Default): feste/minimale Spaltenbreiten; horizontaler Scroll entsteht bei Bedarf;
- `fit`: Spalten werden innerhalb der verfügbaren Breite verteilt; kein horizontaler Scroll.

Auf kleinen Viewports werden Spalten nicht automatisch gestapelt. `scroll` bleibt die sichere Default-Darstellung; Sichtbarkeit oder ein `fit`-Layout werden bewusst konfiguriert. Toolbar und Footer dürfen umbrechen.

Der MVP nutzt DOM-Rendering ohne Windowing. Die interne Renderergrenze darf später Row-Virtualisierung ergänzen, ohne die öffentliche API zu ändern. Ein Canvas-Renderer wird nicht als öffentlicher Modus versprochen.

## Öffentliche Konfiguration

Komplexe Werte werden als JavaScript-Properties beziehungsweise über `configure()` übergeben. JSON in HTML-Attributen ist nicht Teil des Contracts.

```ts
export type NteDataTableRowId = string | number;
export type NteDataTableColumnId = string;

export interface NteDataTableBaseConfig<Row> {
  columns: readonly NteDataTableColumn<Row>[];

  layoutStore?: NteDataTableLayoutStore;
  persistenceKey?: string;
  schemaKey?: string;

  layoutMode?: "scroll" | "fit";
  sortMode?: "none" | "single" | "multiple";

  selection?: {
    rows?: "none" | "single" | "multiple";
    columns?: "none" | "single" | "multiple";
  };

  editing?: {
    activation?: "single-click" | "double-click" | "enter";
    commit?: "enter" | "blur-or-enter";
  };
}

export type NteDataTableConfig<Row> = NteDataTableBaseConfig<Row> &
  (
    | {
        // Bequeme SPA-Variante; intern durch den Array-Connector gekapselt.
        rows: readonly Row[];
        getRowId: (row: Row) => NteDataTableRowId;
        connector?: never;
      }
    | {
        connector: NteDataTableConnector<Row>;
        rows?: never;
        getRowId?: never;
      }
  );
```

`rows` und `connector` sind alternative Datenquellen und dürfen nicht gleichzeitig gesetzt werden. Die `rows`-Variante verlangt einen stabilen `getRowId`-Callback; der Connector besitzt dafür seine eigene `getRowId()`-Methode. Eine widersprüchliche Konfiguration schlägt bereits typseitig und zusätzlich zur Laufzeit verständlich fehl.

Einfache primitive Konfiguration kann zusätzlich als Attribut gespiegelt werden:

| Attribut | Default | Bedeutung |
|---|---|---|
| `layout-mode` | `scroll` | Horizontaler Scroll oder Fit-Verteilung. |
| `persistence-key` | – | Stabiler Schlüssel für persistiertes Layout. |
| `sort-mode` | `single` | Keine, einfache oder mehrfache Sortierung. |
| `readonly` | aus | Deaktiviert alle Editoren, ohne die Spaltendefinition zu ändern. |
| `aria-label` | – | Zugänglicher Name der Tabelle. |

## Spaltenschema

```ts
export interface NteDataTableColumn<Row, Value = unknown> {
  id: NteDataTableColumnId;
  label: string;
  ariaLabel?: string;

  field?: keyof Row;
  value?: (row: Row) => Value;
  setValue?: (row: Row, value: Value) => Row;
  queryKey?: string;

  width?: number;
  minWidth?: number;
  maxWidth?: number;
  flex?: number;
  align?: "start" | "center" | "end";

  pinned?: "start" | "end";
  resizable?: boolean;
  reorderable?: boolean;
  sortable?: boolean;
  searchable?: boolean;
  selectable?: boolean;

  editable?:
    | boolean
    | ((context: NteDataTableCellContext<Row, Value>) => boolean);

  cellType?: string;
  render?: NteDataTableCellRenderer<Row, Value>;
  editor?:
    | "text"
    | NteDataTableSelectEditor<Row, Value>
    | NteDataTableEditorFactory<Row, Value>;

  parse?: (input: unknown, context: NteDataTableCellContext<Row, Value>) => Value;
  validate?: (
    value: Value,
    context: NteDataTableCellContext<Row, Value>,
  ) => void | string | Promise<void | string>;
}

export interface NteDataTableCellContext<Row, Value = unknown> {
  row: Row;
  rowId: NteDataTableRowId;
  rowIndex: number;
  column: NteDataTableColumn<Row, Value>;
  value: Value;
}

export type NteDataTableCellRenderer<Row, Value> = (
  context: NteDataTableCellContext<Row, Value>,
) => Node | string;

export interface NteDataTableSelectEditor<Row, Value> {
  type: "select";
  options:
    | readonly { value: Value; label: string; disabled?: boolean }[]
    | ((
        context: NteDataTableCellContext<Row, Value>,
      ) => Promise<readonly { value: Value; label: string; disabled?: boolean }[]>);
}

export interface NteDataTableMountedEditor<Value> {
  element: HTMLElement;
  readValue(): Value;
  focus(): void;
  destroy?(): void;
}

export type NteDataTableEditorFactory<Row, Value> = (
  context: NteDataTableCellContext<Row, Value>,
) => NteDataTableMountedEditor<Value>;
```

Strings aus Renderern werden immer als Text behandelt, nicht als HTML. Komplexe Zellen nutzen sichere DOM-/Lit-Templates oder registrierte Cell Types.

`pinned: "start" | "end"` ist absichtlich logischer als `left | right` und funktioniert auch in RTL-Layouts. Pins werden über stabile Column-IDs und nicht nur über eine Anzahl „erste N Spalten“ gespeichert. Eine Convenience-Konfiguration darf später die ersten N Spalten auf `start` setzen.

## Daten-Connector

```ts
export interface NteDataTableQuery {
  search: string;
  sort: readonly {
    columnId: NteDataTableColumnId;
    queryKey: string;
    direction: "asc" | "desc";
  }[];
  filters?: readonly unknown[];

  // Bereits im Contract, obwohl Range-Loading erst später vollständig
  // implementiert wird.
  range?: {
    start: number;
    size: number;
  };
}

export interface NteDataTableReadResult<Row> {
  rows: readonly Row[];
  start: number;
  totalRowCount: number | null;
  revision?: string;
}

export interface NteDataTableCellMutation {
  rowId: NteDataTableRowId;
  columnId: NteDataTableColumnId;
  previousValue: unknown;
  value: unknown;
  baseRevision?: string;
}

export interface NteDataTableConnector<Row> {
  getRowId(row: Row): NteDataTableRowId;

  readonly capabilities?: {
    search?: boolean;
    sort?: boolean;
    multiSort?: boolean;
    rangeRead?: boolean;
    updateCells?: boolean;
    moveRows?: boolean;
    liveUpdates?: boolean;
  };

  read(
    query: NteDataTableQuery,
    context: {
      signal: AbortSignal;
      columns: readonly NteDataTableColumn<Row>[];
    },
  ): Promise<NteDataTableReadResult<Row>>;

  updateCells?(
    mutations: readonly NteDataTableCellMutation[],
    context: { signal: AbortSignal },
  ): Promise<{
    updatedRows?: readonly Row[];
    revision?: string;
  }>;

  moveRows?(
    request: {
      rowIds: readonly NteDataTableRowId[];
      beforeRowId: NteDataTableRowId | null;
    },
    context: { signal: AbortSignal },
  ): Promise<void>;

  subscribe?(listener: (change: unknown) => void): () => void;
}
```

Mitgeliefert wird `NteArrayDataTableConnector<Row>`. Er übernimmt lokale Suche, Sortierung und Updates für normale SPA-Arrays. Ein REST-, GraphQL-, IndexedDB- oder anderer Connector implementiert denselben Vertrag.

Der Connector meldet Fähigkeiten explizit. Die Tabelle bietet keine Aktion an, die der Connector nicht ausführen kann.

Begriffe werden getrennt:

- **Sortierung:** Anzeigereihenfolge der Daten anhand einer oder mehrerer Spalten.
- **Column Reordering:** Visuelle Reihenfolge der Spalten.
- **Row Reordering:** Fachliche manuelle Reihenfolge der Datensätze über `moveRows()`.

Row Reordering ist bei aktiver Sortierung standardmäßig deaktiviert, weil die manuelle und die berechnete Reihenfolge sonst widersprüchlich sind.

## Layout-Persistenz

```ts
export interface NteDataTableLayoutSnapshot {
  version: 1;
  schemaKey: string;
  columns: Record<
    NteDataTableColumnId,
    {
      width?: number;
      order?: number;
      pinned?: "start" | "end";
      hidden?: boolean;
    }
  >;
}

export interface NteDataTableLayoutStore {
  load(context: {
    key: string;
    schemaKey: string;
    columnIds: readonly NteDataTableColumnId[];
  }): Promise<NteDataTableLayoutSnapshot | null>;

  save(
    context: { key: string },
    snapshot: NteDataTableLayoutSnapshot,
  ): Promise<void>;

  clear(context: { key: string }): Promise<void>;
}
```

Default ist `NteLocalStorageDataTableLayoutStore`.

Regeln:

- Persistenz wird mit `persistenceKey`, ersatzweise einer stabilen Element-ID aktiviert.
- Fehlen beide, gibt es keine dauerhafte Speicherung und keinen zufälligen Fallback-Key.
- Der gespeicherte Schlüssel ist paket- und versionsnamespaced.
- Im MVP werden nur Breiten geschrieben; `order`, `pinned` und `hidden` sind bereits schemafähig.
- Während des Ziehens wird nur der interne State aktualisiert. Gespeichert wird auf Resize-Ende beziehungsweise debounced.
- Gespeicherte Breiten werden gegen `minWidth` und `maxWidth` validiert.
- Entfernte Spalten werden ignoriert, neue Spalten nutzen Defaults.
- Beschädigtes JSON, Quota- und Privacy-Fehler sind nicht fatal und lösen ein Fehler-Event aus.
- `resetColumnLayout()` löscht den gespeicherten Snapshot.
- Zeilendaten, Search-Text und Auswahl werden nicht im Layout-Store gespeichert.

Weitere Stores, zum Beispiel REST, IndexedDB oder ein Benutzerprofil, werden im Extension-Skill beschrieben.

## Editing-Contract

Editing ist pro Spalte opt-in. Ohne `editable` bleibt die Tabelle eine Read-/Interaction-Tabelle.

MVP-Editoren:

- `text`;
- `select` mit statischen oder asynchron geladenen Optionen.

Editierablauf:

1. Aktivierung über die konfigurierte Pointer-Aktion, `Enter` oder `F2`.
2. Editor liest den aktuellen Zellwert.
3. `parse()` normalisiert den Kandidaten.
4. `validate()` läuft synchron oder asynchron.
5. `nte-data-table-before-edit-commit` wird cancelable ausgelöst.
6. Der Connector erhält eine oder mehrere Cell Mutations.
7. Erfolg aktualisiert die Zeile und löst `nte-data-table-edit-commit` aus.
8. Fehler bleibt sichtbar, setzt `aria-invalid` und löst `nte-data-table-edit-error` aus.

Der MVP arbeitet pessimistisch: Erst ein erfolgreicher Connector-Commit beendet den Pending-State. Optimistische Updates mit Rollback folgen in V1.

Dropdowns sind Editoren und keine Column-Untermenüs. Custom Editors liefern ein echtes fokussierbares Element und einen klaren Mount-/Read-/Destroy-Lifecycle. Allgemeines `contenteditable` wird nicht als Default verwendet.

## Auswahl und Fokus

Der State trennt:

- aktive Zelle/Fokus;
- ausgewählte Row-IDs;
- ausgewählte Column-IDs;
- spätere Cell Ranges.

Selection kann kontrolliert über Properties gesetzt und über Events gespiegelt werden. Shift erweitert eine Auswahl, Ctrl/Meta toggelt Einträge. Stabile IDs sind verbindlich; sichtbare Array-Indizes dürfen nicht als persistente Identität dienen.

## Slots

| Slot | Zweck |
|---|---|
| `caption` | Zugängliche beziehungsweise sichtbare Tabellenbeschreibung. |
| `toolbar-start` | Suche, externe Filter oder View-Auswahl. |
| `toolbar-end` | Anwendungsaktionen für die aktuelle Auswahl. |
| `footer-start` | Ergebnisanzahl oder Status. |
| `footer-center` | Zusätzliche Zusammenfassung. |
| `footer-end` | Externe Pagination oder weitere Controls. |
| `loading` | Ladezustand. |
| `empty` | Keine Ergebnisse. |
| `error` | Fehlerdarstellung. |

Ein Slot platziert nur UI. Ein Suchfeld im `toolbar-start`-Slot wird bewusst über `input` mit `table.setSearch(value)` verbunden; es gibt keine versteckte DOM-Magie.

Spaltenheader und wiederholte Zellen werden über Schema, Renderer und Cell Types konfiguriert, nicht über hunderte dynamische Slots.

## Methoden und Commands

Minimaler imperativer Contract:

```ts
table.configure(config);
table.reload();

table.setSearch("auth");
table.setSort([{ columnId: "name", direction: "asc" }]);

table.setRowSelection(["42", "43"]);
table.setColumnSelection(["status"]);

table.resizeColumn("name", 320);
table.pinColumn("name", "start");
table.moveColumn("status", 1);
table.moveRows(["42"], "50");

table.startEdit("42", "status");
table.commitEdit();
table.cancelEdit();

table.resetColumnLayout();
table.scrollToRow("42", { align: "center" });
```

Intern werden diese Aufrufe auf typisierte Commands abgebildet. Der Reducer bleibt DOM- und I/O-frei.

## Events

Alle öffentlichen Events sind `bubbles: true` und `composed: true`.

| Event | Inhalt |
|---|---|
| `nte-data-table-query-change` | Search-/Sort-/Filter-State. |
| `nte-data-table-selection-change` | Vollständiger kontrollierter Selection-State. |
| `nte-data-table-active-cell-change` | Neue aktive Zelle. |
| `nte-data-table-cell-activate` | Klick, Doppelklick, Enter oder API-Aktivierung. |
| `nte-data-table-row-activate` | Zeilenaktivierung. |
| `nte-data-table-layout-change` | Breite, Reihenfolge, Pinning oder Sichtbarkeit. |
| `nte-data-table-load-start` / `nte-data-table-load` | Connector-Lifecycle. |
| `nte-data-table-error` | Read- oder Layout-Fehler. |
| `nte-data-table-edit-start` | Beginn eines Editors. |
| `nte-data-table-before-edit-commit` | Cancelable Mutation vor dem Connector. |
| `nte-data-table-edit-commit` | Erfolgreiche Mutation. |
| `nte-data-table-edit-error` | Validierungs- oder Connector-Fehler. |
| `nte-data-table-column-reorder` | Neue Spaltenreihenfolge. |
| `nte-data-table-row-reorder` | Erfolgreiche oder angeforderte Zeilenverschiebung. |

Event-Details enthalten zusätzlich `source: "pointer" | "keyboard" | "api" | "restore"`.

## Beispiel

```html
<nte-data-table
  id="issues"
  persistence-key="issues:v1"
  layout-mode="scroll"
  aria-label="Issues"
>
  <input id="issue-search" slot="toolbar-start" type="search" placeholder="Suchen" />
  <span id="issue-count" slot="footer-start"></span>
</nte-data-table>
```

```ts
import type { NteDataTable } from "@nextrap/nte-data-table";
import "@nextrap/nte-data-table";

const table = document.querySelector<NteDataTable<Issue>>("#issues")!;
const search = document.querySelector<HTMLInputElement>("#issue-search")!;

table.configure({
  columns: [
    {
      id: "title",
      label: "Titel",
      field: "title",
      width: 320,
      minWidth: 180,
      pinned: "start",
      sortable: true,
      searchable: true,
      editable: true,
      editor: "text",
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
          { value: "done", label: "Erledigt" },
        ],
      },
    },
  ],
  rows: issues,
  getRowId: (issue) => issue.id,
  persistenceKey: "issues:v1",
  layoutMode: "scroll",
  sortMode: "multiple",
  selection: {
    rows: "multiple",
    columns: "multiple",
  },
});

search.addEventListener("input", () => table.setSearch(search.value));
```

## Accessibility

Die Interaktion folgt dem [WAI-ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/).

MVP-Anforderungen:

- Read-only ohne Grid-Interaktion behält native Tabellensemantik.
- Interaktiver Modus nutzt `role="grid"` mit korrekten Row-/Column-Header-Beziehungen.
- Roving Tabindex: Nur die aktive Zelle liegt in der normalen Tab-Reihenfolge.
- Pfeiltasten navigieren; `Home`, `End`, `Ctrl+Home` und `Ctrl+End` springen logisch.
- `Enter` oder `F2` startet Editing, `Escape` verwirft, `Tab` bestätigt und wechselt.
- `aria-sort` kennzeichnet Sortierung; Multi-Sort wird zusätzlich angekündigt.
- `aria-selected` kennzeichnet ausgewählte Zeilen beziehungsweise Spalten.
- Resize Handles sind fokussierbare `role="separator"` mit Min/Max/Now und Pfeiltastensteuerung.
- Drag-and-drop erhält immer eine Tastatur-/API-Alternative.
- Validierungsfehler verwenden `aria-invalid`, Beschreibung und Live Region.
- Pinned Cells werden nicht als zweite fokussierbare DOM-Kopie gerendert.
- Forced Colors, sichtbarer Fokus und Reduced Motion werden berücksichtigt.
- Bei späterer Virtualisierung beziehen sich `aria-rowcount`, `aria-rowindex` und `aria-colindex` auf die logischen, nicht nur auf die gerenderten Positionen.

Virtualisierung und eingefrorene Bereiche benötigen explizite Screenreader-Tests; sie werden nicht allein anhand korrekter ARIA-Attribute als fertig betrachtet.

## Themeing

Die Komponente folgt den aktuellen Nextrap-Regeln:

- Basis ist `nextrap_element()` aus `@nextrap/nt-core`.
- Shadow-DOM-CSS enthält nur funktional notwendiges Layout, Sticky-/Scroll- und Interaktions-CSS.
- `@nextrap/style-reset` darf im Shadow DOM verwendet werden.
- `@nextrap/style-base` wird nicht im ausgelieferten Runtime-Code importiert.
- Die vollständige visuelle Baseline liegt in `default-style()` und wird an `.style-default` gebunden.
- Kombinierbare Features verwenden `with-*`; einzelne Farben, Breiten oder Abstände erzeugen keine neue `style-*`-Variante.
- Öffentliche Elemente erhalten `id` und `part`.

Vorgesehene Parts sind mindestens:

`frame`, `toolbar`, `toolbar-start`, `toolbar-end`, `viewport`, `table`, `header`, `header-cell`, `resize-handle`, `body`, `row`, `cell`, `editor`, `footer`, `footer-start`, `footer-center`, `footer-end`, `loading`, `empty` und `error`.

Spaltenzellen können zusätzlich einen sanitisierten Part-Token wie `col-status` erhalten. Themeing darf nicht von privaten Shadow-DOM-Strukturen oder generierten Selektoren abhängen.

Die genaue öffentliche Variablenliste wird vor Implementierung separat bestätigt. Erwartbare funktionale Kandidaten sind Row-/Header-Höhe, Resize-Hit-Area und Viewport-Höhe; visuelle Werte kommen bevorzugt aus `--nt-*` Tokens und dem Package-Mixin.

## Package-Dokumentation und Skills

Das spätere Package erhält gemäß Repo-Standard:

- `.agents/skills/nte-data-table-usage/SKILL.md`;
- `.agents/skills/nte-data-table-theming/SKILL.md`;
- zusätzlich `.agents/skills/nte-data-table-extensions/SKILL.md`;
- eine kurze `.ai-usage-info.md` während der Übergangszeit;
- `web-types.json`;
- Demos im Vite Demo Viewer.

Der zusätzliche Extension-Skill dokumentiert konkret:

- einen eigenen `NteDataTableConnector`;
- einen REST- und einen IndexedDB-Read-Adapter als Muster;
- einen eigenen `NteDataTableLayoutStore`;
- Versionierung, unbekannte Spalten und beschädigte Payloads;
- `AbortSignal`, Race Handling und Capabilities;
- einen eigenen Renderer/Editor/Validator;
- Contract-Tests für Connectoren und Stores;
- die Regel, keine Row-Daten oder personenbezogenen Inhalte in den Layout-Store zu schreiben.

## Feature-Roadmap

### Phase 1 – MVP: Display, Interaktion und Editing

- aktuelles NTE-Package-Gerüst mit Root-`index.ts`, Web Types, Usage-/Themeing-/Extension-Skills;
- Column Schema und stabile Row-/Column-IDs;
- direkte `rows`-Property plus `NteArrayDataTableConnector`;
- generischer Async-Connector für Reads und Cell Updates;
- fester Toolbar-/Header-Bereich, scrollender Body und fester Footer;
- `scroll`- und `fit`-Layout;
- konfigurierbare Start-/End-Pins;
- Column Resize per Pointer und Tastatur;
- Default-LocalStorage-Store mit austauschbarem Interface;
- aktiver Cell-/Row-Click;
- Single-/Multi-Selection für Rows und Columns;
- einfache und mehrfache Spaltensortierung;
- Search-State plus Toolbar-Slot;
- Text- und Select-Editor, Parser, synchrone/async Validierung;
- Loading-, Empty- und Error-State;
- grundlegende Keyboard-/ARIA-Umsetzung;
- funktionale Parts und `default-style()`.

### Phase 2 – Produktives Data Grid

- eigene Cell-Type-/Editor-Registry;
- Column Reordering mit Persistenz;
- Connector-gesteuertes Row Reordering;
- Row Reordering bei aktiver Sortierung sperren oder ausdrücklich vom Connector erlauben;
- Number-, Boolean- und Date-Cell-Types;
- optimistische Updates mit Rollback und Pending-/Dirty-State;
- Spalten-Autosize und Sichtbarkeit;
- kontrollierter Filter-State ohne eingebautes Column-Menü;
- externe Pagination über Footer-Slot;
- Live-Updates über `subscribe`;
- Saved Layout Presets;
- vollständige Connector-/Store-Contract-Tests.

### Phase 3 – Scale und Lazy Data

- Row-Virtualisierung mit fester Zeilenhöhe und Overscan;
- Range-/Cursor-Reads, Cache, Deduplizierung und Retry;
- scrollbasierte Nachladung;
- gepinnte Summary Rows;
- Column-Virtualisierung erst bei nachgewiesenem Bedarf;
- variable Zeilenhöhen erst nach stabiler Fixed-Height-Virtualisierung;
- optionale Worker-basierte lokale Suche und Sortierung.

### Phase 4 – Vollständige Arbeitsoberfläche

- Cell-/Range-Selection;
- Copy/Paste, Bulk Edit und Bulk Clear;
- Undo/Redo;
- Fill Handle;
- Aggregationen und Summary-Footer;
- Export-Hooks;
- serverseitig gespeicherte Views und Berechtigungen;
- optionale Gruppierungs-Erweiterung.

Pivoting, Formeln, Charts, Tree Data und Column-Untermenüs bleiben auch hier außerhalb des Cores und würden nur als separat freigegebene Erweiterungen betrachtet.

## Akzeptanzkriterien für das MVP

- Eine Tabelle kann allein mit `columns` und `rows` in einer SPA angezeigt werden.
- Dieselbe Tabelle kann stattdessen einen eigenen Connector verwenden.
- Header und Footer bleiben sichtbar, während nur der Viewport scrollt.
- Horizontaler Scroll ist über `layout-mode` ein- beziehungsweise ausschaltbar.
- Beliebige Spalten können an `start` oder `end` gepinnt werden.
- Spaltenbreiten werden über stabile IDs gespeichert und nach Reload korrekt restauriert.
- Ein eigener Layout-Store lässt sich ohne Subclassing der Komponente einsetzen.
- Zeilen und Spalten lassen sich einzeln und mehrfach auswählen.
- Search und Sort funktionieren lokal und werden für Remote-Connectoren als Query weitergereicht.
- Text- und Select-Zellen lassen sich opt-in editieren; Validation und Connector-Fehler sind sichtbar.
- Row-/Cell-Aktivierung ist als Event nutzbar.
- Keyboard-Navigation, Resize und Editing funktionieren ohne Pointer.
- Die Tabelle ist über Parts und `default-style()` themebar.
- Loading, Empty und Error sind über Slots anpassbar.
- Es gibt keine Column-Menüs oder versteckte UI-Abhängigkeiten.
- Eine große Demo definiert die Performance-Baseline; Virtualisierung wird anhand Messwerten und nicht anhand einer unbelegten Zeilenzahl aktiviert.

## Offene Entscheidungen vor der Implementierung

| Entscheidung | Empfehlung |
|---|---|
| Interner Core ohne Dependency oder TanStack Table? | MVP zunächst dependency-frei; öffentliche Contracts so halten, dass ein interner TanStack-Adapter später möglich bleibt. |
| RevoGrid statt Eigenbau? | Nur wählen, wenn schnelle Vollständigkeit wichtiger als NTE-Theme-/API-Kontrolle ist und Pro-/Attribution-Fragen geklärt sind. |
| Default für horizontales Verhalten? | `layout-mode="scroll"`; `fit` bewusst aktivieren. |
| Persistenz ohne expliziten Key? | Nur stabile Element-ID als Fallback, niemals ein Zufalls-Key. |
| Commit-Strategie? | Pessimistisch im MVP; optimistisch mit Rollback in Phase 2. |
| Row Reordering bei Sortierung? | Standardmäßig deaktiviert. |
| Virtualisierungsziel? | Nach einer Benchmark-Demo festlegen; zuerst Row-, später gegebenenfalls Column-Virtualisierung. |

## Implementierungsgrenze

Das eigentliche Package betrifft deutlich mehr als drei beziehungsweise fünf Dateien. Gemäß Repository- und Projektvorgaben beginnt die Implementierung deshalb erst nach Review und ausdrücklicher Freigabe dieses Proposals in einem separaten Feature-PR.

Eine sinnvolle inkrementelle Umsetzung ist:

1. Package-Gerüst, DOM-Viewport, Column Schema, Array Connector und Layout Store;
2. Selection, Search, Sort und Editing;
3. Column-/Row-Reordering sowie weitere Cell Types;
4. Virtualisierung und Remote-Lazy-Loading nach Benchmark.