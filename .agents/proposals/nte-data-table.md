# NTE Data Table – Proposal

**Status:** Proposed  
**Paket:** `@nextrap/nte-data-table`  
**Element:** `<nte-data-table>`  
**API-Details:** [nte-data-table-api.md](./nte-data-table-api.md)

## Kurzentscheidung

`nte-data-table` wird als erweiterbare, DOM-basierte Web Component für Single-Page Applications geplant. Die öffentliche API gehört Nextrep; Datenzugriff, Layout-Persistenz und Zelltypen liegen hinter eigenen Verträgen. Der Standardfall ist eine gut lesbare Datentabelle. Auswahl, Sortierung, Suche, Editing, Pinning und Reordering werden explizit zugeschaltet.

Die Komponente rendert genau einen semantischen Tabellen-/Grid-Baum. Kopf und Fuß bleiben sticky, der Body scrollt. Canvas und getrennte Header-/Body-Tabellen sind keine Basis des MVP. Eine Phase-0-Spike entscheidet nur, ob der interne Tabellen-State klein und nativ bleibt oder durch TanStack Table unterstützt wird; die öffentliche NTE-API bleibt davon unberührt.

Das interaktive MVP besteht aus zwei lieferbaren Inkrementen:

- **Phase 1A:** Darstellung, Connector, Sticky Layout, Spaltenbreiten, Pinning, Suche, Single-Sort, Aktivierung, einfache Auswahl und Persistenz.
- **Phase 1B:** Text-/Select-Editing, Validierung, Multi-Selection, Multi-Sort, Column Reordering und `fit`-Layout.

## Bezug zu bestehender Arbeit

PR #48 („airtable-2: Add nte-data-table component“) und Issue #26 werden als UI-Spike und Vorarbeit berücksichtigt. Der alte Ansatz zeigt Sticky Header/Footer und Column Resize, entspricht aber nicht mehr den aktuellen Paketkonventionen und enthält noch keine stabilen Verträge für Connector, Editing, Query-State, Auswahl, Pinning, Virtualisierung oder austauschbare Persistenz.

Dieses Proposal ersetzt den technischen Ansatz von PR #48, schließt oder überschreibt die bestehende Arbeit aber nicht automatisch.

## Ziele

- Daten in einer SPA schnell, semantisch und zugänglich darstellen.
- Sticky Header und Sticky Footer mit einem dazwischenliegenden Scrollbereich.
- Optionale horizontale Navigation, einstellbare Breiten und logisch gepinnte Start-/End-Spalten.
- Single- und Multi-Selection für Zeilen und Spalten.
- Suche, Sortierung, Column Reordering und optionales Row Reordering klar voneinander trennen.
- Optionales In-Cell-Editing, zunächst Text und Select, später eigene Zelltypen.
- Slots für Suche, eigene Toolbar-Inhalte, Ergebnisanzahl, Pagination und Status.
- Lokale Arrays und asynchrone Datenquellen über denselben Query-/State-Ablauf unterstützen.
- Layoutzustand über ein austauschbares Store-Interface speichern; eine Local-Storage-Implementierung mitliefern.
- Styling über NTE-Default-Style, CSS Custom Properties, Parts und Slots anpassbar halten.
- Den späteren Wechsel zu Range Loading und Row Virtualization ohne Bruch der öffentlichen API ermöglichen.

## Nicht-Ziele

- Keine eingebauten Kontext-, Header- oder Untermenüs.
- Kein vollständiger Excel-Klon im MVP.
- Keine Pivot Tables, Formeln, Charts, Tree Data oder Grouping im Kern.
- Keine fest verdrahtete REST-, GraphQL- oder Backend-Implementierung.
- Keine serverseitige Rechteverwaltung oder Saved-View-Verwaltung im Element.
- Kein ungefragtes Persistieren von Zeilen, Suchbegriffen oder Auswahl im Browser.
- Kein Canvas-Renderer im ersten Ausbau.
- Keine variable Row Height vor einer belastbaren festen Virtualisierungsstrategie.

## Markt- und Open-Source-Vergleich

Stand der Recherche: August 2026. Aussagen und Lizenzgrenzen sind vor einer tatsächlichen Übernahme einer Abhängigkeit nochmals zu prüfen.

| Produkt | Modell und typischer Einsatz | Relevanter Umfang | Konsequenz für NTE |
| --- | --- | --- | --- |
| [TanStack Table](https://tanstack.com/table/latest/docs/overview) | MIT, headless, mit offizieller [Lit-Integration](https://tanstack.com/table/latest/docs/framework/lit); anwendungsnahe Tabellen und eigene Designsysteme | Sortierung, Selection, Sizing, Ordering und Pinning als State; Rendering, Editing und Datenzugriff bleiben bei der App | Stärkster Kandidat für einen optionalen internen State-Kern, ohne NTE an fremdes DOM oder Styling zu binden |
| [AG Grid](https://www.ag-grid.com/javascript-data-grid/community-vs-enterprise/) | Community unter MIT, Enterprise kommerziell; große Business-Grids | Viele Editoren, Selection, Pinning, [Row Models](https://www.ag-grid.com/javascript-data-grid/row-models/) und [DOM-Virtualisierung](https://www.ag-grid.com/javascript-data-grid/dom-virtualisation/) | Sehr vollständige Buy-Alternative, aber Enterprise-Abgrenzung, API-Oberfläche und Styling passen nicht als schlanker NTE-Standard |
| [Tabulator](https://www.tabulator.info/) | MIT, vollständiges DOM-Grid für klassische Webanwendungen | Editing, Frozen Columns, Selection, Remote Data, [Virtual DOM](https://www.tabulator.info/docs/6.x/virtual-dom/) und [Persistence](https://www.tabulator.info/docs/6.x/persist) | Gute Funktionsreferenz und schnelle Integrationsalternative; weniger passend für eine eigene Lit-/NTE-Komponenten-API |
| [RevoGrid](https://rv-grid.com/guide/) | MIT-Core als Web Component, zusätzliche Pro-Angebote; große editierbare Grids | Virtual DOM, Editing, Pinning, Plugins und [State Persistence](https://rv-grid.com/guide/state-persistence) | Beste Wrapper-/Time-to-market-Alternative. Vor Übernahme sind Pro-Grenzen, Attribution, Themeing und langfristige API-Kopplung zu klären |
| [Handsontable](https://handsontable.com/) | Source-available, kommerzielle Produktionslizenz; spreadsheet-nahe Business-Anwendungen | Cell-/Range-Selection, Editoren, Validierung, Clipboard, Frozen Rows/Columns und [Virtualisierung](https://handsontable.com/docs/javascript-data-grid/row-virtualization/) | Stärkste UX-Referenz für spätere Spreadsheet-Funktionen, aber keine geeignete Standardabhängigkeit für ein frei erweiterbares NTE-Paket |
| [Glide Data Grid](https://github.com/glideapps/glide-data-grid) | MIT, React und Canvas; sehr große Datensätze | Performantes Scrolling, Editing, Resize, Move und Selection | Performance-Referenz. Canvas kollidiert mit NTE-Parts, DOM-Slots und einer einfachen Accessibility-Strategie |
| [MUI X Data Grid](https://mui.com/x/react-data-grid/) | React; Community plus kommerzielle Pro-/Premium-Stufen | Große Produkt-API, Server-[Data Source](https://mui.com/x/react-data-grid/server-side-data/), Editing, Selection und Premium-Funktionen | Gute Referenz für Connector-Capabilities, aber React- und Lizenzkopplung schließen einen direkten NTE-Standard aus |
| [Airtable Grid View](https://support.airtable.com/articles/7905594155-airtable-grid-view) | Closed Source; kollaborative Datensichten | Feldtypen, Resize/Reorder, Frozen Fields, Sort/Filter und Editing | UX-Vorbild für progressive Interaktion, nicht für die interne Architektur |
| [GitHub Projects Table](https://docs.github.com/en/issues/planning-and-tracking-with-projects/customizing-views-in-your-project/customizing-the-table-layout) | Closed Source; planungsorientierte Datensichten | Inline Editing, Field Layout, Sortierung, Gruppierung und Saved Views | UX-Vorbild für eine ruhige Tabelle ohne permanent sichtbare Menüstruktur |

### Erkenntnisse aus dem Vergleich

1. **Headless-Verträge sind die stabilste Erweiterungsgrenze.** TanStack und die Data-Source-Modelle kommerzieller Grids trennen Query-State von Rendering und Datenzugriff.
2. **Editing braucht Zelltypen, nicht viele Spezialattribute.** Handsontable, AG Grid, Tabulator und RevoGrid modellieren Renderer, Editor, Parser und Validator getrennt.
3. **Virtualisierung ist eine Rendering-Strategie.** Sie darf Connector, Selection und Layout-Persistenz nicht definieren.
4. **Persistence ist Anwendungspolitik.** Tabulator und RevoGrid zeigen den Nutzen, Handsontables Entwicklung zeigt aber auch, warum ein austauschbarer Store besser als festes `localStorage` im Renderer ist.
5. **Spreadsheet-Funktionen vervielfachen Scope und Accessibility-Aufwand.** Range Selection, Clipboard, Undo und Fill Handle gehören daher in spätere Phasen.
6. **Ein DOM-Grid ist für NTE der passende Start.** Es harmoniert mit Custom Elements, Slots, Parts, Testing und dem Designsystem. Canvas bleibt nur eine denkbare Spezialalternative.

## Umsetzungsalternativen

### A. Eigener NTE-Kern mit nativem DOM-Renderer – bevorzugte Ausgangslage

Vorteile:

- volle Kontrolle über Web-Component-API, DOM, Parts und Accessibility;
- kein fremdes Lizenz- oder Themeing-Modell;
- kleinster Scope für eine reine Data Table;
- Connector, LayoutStore und Cell Types können exakt auf NTE zugeschnitten werden.

Risiken:

- Navigation, Pinning, Multi-Sort und Selection benötigen eigene State-Tests;
- Virtualisierung muss später gezielt entwickelt oder ergänzt werden.

### B. NTE-API mit TanStack Table als internem State-Kern – gleichwertiger Spike-Kandidat

Vorteile:

- erprobter State für Sizing, Ordering, Pinning, Sortierung und Selection;
- headless und mit Lit integrierbar;
- NTE behält DOM, Slots, Styling und Connector-Verträge.

Risiken:

- zusätzliche Root-Dependency und Adapter-Code;
- NTE muss verhindern, dass TanStack-Typen Teil der öffentlichen API werden;
- Editing, Persistenz und Async Connector bleiben eigene Arbeit.

### C. RevoGrid-Wrapper – Time-to-market-Alternative

Sinnvoll, wenn sehr große Datenmengen und Virtualisierung bereits in der ersten Lieferung zwingend sind. Ein Wrapper muss trotzdem NTE-Events, Themeing und Datenadapter definieren. Vorher braucht es eine Lizenz-/Attribution-/Pro-Feature-Prüfung sowie einen Accessibility- und Shadow-DOM-Prototyp.

### D. AG Grid oder Handsontable einkaufen

Sinnvoll für ein konkretes Produkt mit Budget und kurzfristigem Bedarf an Spreadsheet-, Pivot- oder Enterprise-Funktionen. Nicht geeignet als allgemeine Standardbasis des frei erweiterbaren NTE-Pakets.

### Phase-0-Entscheidungsspike

Native State/DOM und TanStack-intern werden mit identischem NTE-Prototyp verglichen:

- 2.000 Zeilen × 20 Spalten;
- Sticky Header/Footer, zwei gepinnte Start-Spalten;
- Resize, Column Move, Search, Sort und Auswahl;
- ein Text-Editor;
- Keyboard- und Screenreader-Smoke-Test;
- Bundle-Differenz, API-Leakage, Testbarkeit und Implementierungsaufwand.

Entscheidungskriterium ist nicht die längste Featureliste, sondern die kleinere, wartbare Implementierung bei unveränderter öffentlicher API. RevoGrid wird nur dann als dritte Spike-Variante aufgenommen, wenn Virtualisierung eine Phase-1-Anforderung wird.

## Architektur

| Schicht | Verantwortung | Erweiterungspunkt |
| --- | --- | --- |
| `NteDataTable` | öffentliche Properties, Slots, Methoden und Events | stabiler NTE-Vertrag |
| Controller/State | Query, Layout, Selection, Fokus, Edit- und Ladezustand | später optional kontrollierter Adapter |
| Renderer | ein DOM-Baum, Sticky Layout, Navigation, Resize, Pinning | austauschbare interne Rendering-Strategie |
| `NteDataTableConnector` | Lesen und optional Mutieren/Verschieben | Array-, REST-, IndexedDB- oder App-Connector |
| `NteDataTableLayoutStore` | serialisierbares Layout laden/speichern/löschen | Local Storage als mitgelieferter Default |
| Cell-Type-Registry | Anzeige, Sort-/Suchwert, Editor, Parser, Validator | eigene Zelltypen ohne Änderung am Kern |

Die Kernregel lautet: Connector und Store erhalten nur serialisierbare Daten-/Query-Beschreibungen. DOM-Nodes, Lit-Templates, Renderer-Callbacks und komplette UI-Spaltendefinitionen verlassen die Komponente nicht.

## Rendering und Layout

### Ein semantischer Baum

Der Default-Renderer verwendet einen einzigen Tabellenbaum innerhalb eines Scrollports. `thead` und `tfoot` sind sticky; `tbody` bleibt Teil desselben Elements. Damit bleiben Header-Zuordnung, Spaltenbreiten und logische Reihenfolge konsistent. Getrennte synchronisierte Tabellen für Header, Body und Footer sind ausgeschlossen.

`interactionMode` bestimmt die Semantik:

- `table`: reine Datendarstellung mit normaler Tabelleninteraktion;
- `grid`: roving Tabindex und zellweise Tastaturnavigation;
- `auto` als Default: `grid`, sobald `activation` nicht `none`, eine Selection nicht `none` oder Editing aktiviert ist; sonst `table`.

`readonly` sperrt ausschließlich Daten-Edits und das spätere Row Reordering. Query, Navigation, Selection, Resize, Pinning und Column Reordering bleiben verfügbar. Ein vollständig gesperrter Zustand wäre eine separate `disabled`-Semantik und gehört nicht zum MVP.

### Höhenvertrag

Für einen internen vertikalen Scrollbereich braucht der Host eine begrenzte `block-size`, `max-block-size` oder einen entsprechend begrenzten Parent. Ohne Begrenzung wächst die Tabelle natürlich mit ihren Zeilen; es wird kein künstlicher interner Viewport erzwungen. Das wird in Demo und Usage-Skill sichtbar dokumentiert.

### Responsive Verhalten

Bei schmalem Viewport bleiben Spaltenbreiten, Min-/Max-Grenzen und Pin-Zonen deterministisch. `scroll` erzeugt horizontalen Overflow; `fit` verteilt nur tatsächlich verfügbare Restbreite und fällt bei unvereinbaren Mindestbreiten ebenfalls auf Overflow zurück. Slots dürfen umbrechen, ohne den Scrollport oder Sticky Header/Footer zu entkoppeln. Die Komponente definiert keine geräteabhängigen versteckten Spalten; responsive Visibility steuert die App später über serialisierbaren State.

### Breiten und horizontales Scrollen

Jede Spalte besitzt `width`, `minWidth`, `maxWidth` und optional `flex`.

- `scroll` ist der Default: Breiten bleiben stabil; wenn die Summe größer als der Viewport ist, entsteht horizontaler Overflow.
- `fit` folgt in Phase 1B: Restbreite wird nach `flex` verteilt. Unterschreitet die Summe der Mindestbreiten den Viewport nicht, fällt auch `fit` deterministisch auf Overflow zurück.
- Während eines Resize wird nur zentraler Layout-State geändert; die native Variante schreibt die resultierenden Breiten über ein `colgroup`.
- Pointer- und Keyboard-Resize verwenden dieselben Commands.
- Gespeicherte Breiten werden beim Laden gegen aktuelle Min-/Max-Werte geklemmt.

### Pinning und Reihenfolge

Spalten werden immer in drei Zonen normalisiert:

1. `start`,
2. ungepinntes Center,
3. `end`.

Die relative Reihenfolge innerhalb einer Zone bleibt erhalten. `moveColumn()` bewegt standardmäßig nur innerhalb der aktuellen Zone; `pinColumn(id, "start" | "end" | null)` wechselt die Zone explizit. Logische Richtungen funktionieren auch in RTL. Gepinnte Zellen werden nicht dupliziert.

### Slots

| Slot | Zweck |
| --- | --- |
| `caption` | sichtbare oder screenreader-taugliche Tabellenbeschreibung |
| `toolbar-start` | Suche, externe Filter oder eigene Controls |
| `toolbar-end` | eigene Aktionen |
| `header-start`, `header-end` | zusätzliche Inhalte oberhalb des Tabellen-Headers |
| `footer-start` | beispielsweise Ergebnisanzahl |
| `footer-center` | Status oder eigene Zusammenfassung |
| `footer-end` | Pagination oder Aktionen |
| `loading`, `empty`, `error` | anwendungsspezifische Zustandsdarstellung |

Die Komponente baut kein Suchfeld und keine Menüs ein. Ein Suchfeld im Slot ruft über die App `setSearch()` auf. Dynamische Slots pro Zelle werden vermieden; dafür gibt es Renderer und Cell Types.

## Daten- und State-Modell

### Zwei klar getrennte Datenmodi

**Direkter Array-Modus**

- `configure({ rows, getRowId, columns })` übernimmt eine neue Array-Kopie.
- Der Direct-Array-Controller verarbeitet Accessor-, Sort- und Search-Hooks intern; dafür wird kein öffentlicher Array-Connector mit UI-Callbacks eingeführt.
- Der Controller hält einen vollständigen kanonischen `sourceRows`-Bestand und berechnet daraus die gefilterte/sortierte View.
- Caller-Zeilen werden nie direkt mutiert; die Container sind readonly, Row-Objekte gelten immutable-by-contract und werden nicht tief geklont oder eingefroren.
- Bei einer Feldänderung erzeugt die Tabelle eine flache Kopie der betroffenen Zeile und ein neues Array.
- Bei berechneten Accessors ist Array-Editing nur mit `setValue(row, value)` möglich; auch dieser Hook muss eine Ersatzzeile liefern.
- `getRows()` liefert den vollständigen kanonischen Bestand, `getVisibleRows()` die Query-View und `setRows()` ersetzt `sourceRows`.
- Nach lokaler Mutation wird `nte-data-table-rows-change` mit dem vollständigen neuen Bestand ausgelöst; herausgefilterte Rows gehen nie verloren.

**Connector-Modus**

- Der Connector ist die autoritative Datenquelle.
- Query-Änderungen lösen einen abbrechbaren Read aus; verspätete Antworten werden verworfen.
- Editing ist nur verfügbar, wenn `updateCells()` implementiert und in der Komponente aktiviert ist.
- Ein Feld verwendet standardmäßig seinen Feldnamen als `mutationKey`; ein berechneter Accessor benötigt im Connector-Modus einen expliziten `mutationKey`. Der Mutation-Key ist vom Sort-/Search-`queryKey` getrennt.
- Liefert eine Mutation aktualisierte Zeilen, werden diese eingepatcht. Andernfalls wird der aktuelle Bereich neu geladen.
- Row Reordering folgt erst in Phase 2 über eine typisierte `moveRows()`-Connector-Erweiterung und ist bei aktiver Datensortierung standardmäßig deaktiviert.

Die beiden Modi sind in der Konfiguration gegenseitig exklusiv.

### Query-State

Der öffentliche Sort-State enthält nur `columnId` und `direction`. Der Connector erhält einen aufgelösten `queryKey`; dieser entsteht aus `column.queryKey`, sonst einem String-`field`, sonst der Spalten-ID. Filter werden nicht als untypisiertes Feld in das MVP geschoben. Eine typisierte, diskriminierte Filter-API folgt in Phase 2.

Der Direct-Array-Pfad berücksichtigt `sortValue`, `compare` und `searchText`. Ohne Override gilt: stabile Sortierung, `null`/`undefined` unabhängig von der Richtung zuletzt, Zahlen numerisch, Text über `Intl.Collator(locale, { numeric: false, sensitivity: "base" })`, numerische Strings als Text und case-insensitive NFKC-Substring-Suche. `locale` ist explizit konfigurierbar und standardmäßig `"en"`; leere Suche wird zu Connector-`null`.

### Interner State

Der State ist intern verwaltet, aber vollständig les- und setzbar:

- `getState()` liefert readonly Container; Row-Objekte bleiben immutable-by-contract und werden aus Performancegründen nicht tief gefroren;
- gezielte Methoden ändern Query, Selection und Layout;
- Events melden jede akzeptierte Änderung;
- ein wirklich kontrollierter Framework-Adapter kann später auf diesen Verträgen aufbauen.

Es gibt im MVP keine Behauptung, dass jede Property automatisch ein „controlled component“-Muster implementiert.

## Layout-Persistenz

`NteDataTableLayoutStore` lädt, speichert und löscht versionierte Layout-Snapshots. Mitgeliefert wird `NteLocalStorageDataTableLayoutStore`.

Aktivierungsregeln:

| Konfiguration | Ergebnis |
| --- | --- |
| `layoutStore: null` oder `persistLayout: false` | immer aus |
| nichtleerer `persistenceKey` | an |
| `persistLayout: true` und stabile Host-`id` | an, Host-ID als Key |
| `persistLayout: true` ohne effektiven Key | aus plus recoverable Konfigurations-Event |
| eigener Store ohne Key/Opt-in | aus |

`effectiveKey = (persistenceKey ?? "").trim() || host.id.trim()`. Der eigene Store allein aktiviert keine Persistenz. Der Local-Storage-Keyspace lautet `nte-data-table:<effectiveKey>`.

- Der Local-Storage-Store ist die Standardimplementierung, sobald Persistenz aktiviert ist und kein eigener Store gesetzt wurde.
- Der Default-`schemaKey` ist deterministisch aus Store-Version und sortierten Spalten-IDs abgeleitet; Apps können für kontrollierte Migrationen einen eigenen Key setzen.
- Gespeichert werden in Phase 1 Breite, Reihenfolge und Pin-Zone.
- Zeilendaten, Suche, Auswahl und Edit-Inhalte gehören nicht in diesen Store.
- Unbekannte alte Spalten werden ignoriert; neue Spalten erhalten Defaults.
- Beschädigte Payloads, Quota-, Privacy- und Security-Fehler sind nicht fatal und werden als typisierte Fehler-Events gemeldet.
- Während des Ziehens wird nur State aktualisiert; Speicherung erfolgt nach Abschluss beziehungsweise debounced.

## Editing und Zelltypen

Editing ist pro Tabelle und Spalte opt-in. Phase 1B liefert:

- `text`;
- `select` mit synchronen oder asynchronen Optionen und `AbortSignal`;
- Parser und synchrone/asynchrone Validierung;
- Custom Renderer;
- Custom Editor über einen klaren Mount-/Read-/Focus-/Destroy-Lifecycle.

Aktivierung: Doppelklick, `Enter` oder `F2`. Commit: `Enter` oder Blur. Abbruch: `Escape`. `Tab` bestätigt und bewegt sich zur nächsten editierbaren Zelle; am Grid-Rand verlässt Tab die Komponente.

Ein expliziter Spaltenhook überschreibt die jeweilige Funktion des registrierten Cell Types. Nicht überschriebene Funktionen bleiben vom Cell Type erhalten. Strings aus Renderern werden als Text behandelt; Lit-Templates und Nodes werden regulär gemountet, nicht per `innerHTML`.

Remote-Editing ist im interaktiven MVP pessimistisch: Nach Validation bleibt der bisher bestätigte Row-Wert autoritativ, während der Editor einen Saving-State zeigt. Erst eine erfolgreiche Connector-Antwort patcht beziehungsweise lädt die Row und löst das Commit-Event aus; die Event-Row ist optional, falls die Row nach Reload nicht mehr in der Query-View liegt. Bei Fehler bleibt der Draft korrigierbar. Optimistic Update, Rollback und Revisionskonflikte folgen erst in Phase 2.

## Selection, Sortierung und Reordering

Die Begriffe bleiben strikt getrennt:

- **Selection:** Zeilen oder Spalten, `none`, `single` oder `multiple`;
- **Data Sorting:** Zeilenansicht nach einer oder mehreren Spalten;
- **Column Reordering:** visuelle Spaltenreihenfolge innerhalb beziehungsweise per Pin-Command zwischen Zonen;
- **Row Reordering:** manuelle Datenreihenfolge über Connector-Mutation.

Die Default-Gestenpriorität ist deterministisch:

1. aktiver Editor;
2. Resize Handle;
3. Reorder Handle;
4. Selection/Activation;
5. Sort-Aktion am Header.

Eine normale Header-Aktivierung sortiert nur, wenn die Spalte sortierbar ist. Auswahl und Drag beginnen an getrennten Controls/Hotspots. Es gibt keine versteckten Header-Menüs.

## Accessibility

Die Umsetzung folgt dem [WAI-ARIA Grid Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/grid/) dort, wo Grid-Interaktion aktiv ist, und bleibt sonst eine semantische Tabelle.

- `caption` hat Vorrang als zugänglicher Name; andernfalls wird Host-`aria-label` auf den inneren Tabellen-/Grid-Baum übertragen.
- Im Grid-Modus liegt nur die aktive Zelle im Tab-Flow.
- Pfeile navigieren; Home/End und Ctrl/Cmd+Home/End springen logisch.
- `Enter`/`F2`, `Escape` und `Tab` folgen dem Editing-Vertrag.
- `aria-sort`, `aria-selected`, sichtbarer Fokus und Live-Regionen bilden State ab.
- Das Resize Handle ist ein fokussierbarer Separator mit Keyboard-Steuerung.
- Reordering hat immer eine Tastaturalternative.
- Bei unbekannter Gesamtzahl gilt `aria-rowcount="-1"`.
- Virtualisierte Zeilen verwenden später logische `aria-rowindex`-Werte.
- Gepinnte Spalten bleiben ein einziges DOM-Vorkommen.
- Forced Colors, Reduced Motion, RTL und 200-%-Zoom gehören zu den Abnahmetests.

## Styling und Nextrep-Konventionen

Das Paket folgt dem bestehenden `nte-*`-Muster:

- Element erweitert `nextrap_element()` aus `@nextrap/nt-core`;
- Shadow-CSS bleibt funktional und minimal;
- visuelles Default-Styling kommt aus dem Paket-Mixin `default-style()` und wird über `.style-default` aktiviert;
- keine Runtime-Abhängigkeit auf `@nextrap/style-base`;
- `::part()` exponiert mindestens `frame`, `toolbar`, `caption`, `scrollport`, `table`, `header`, `header-cell`, `body`, `row`, `cell`, `footer`, `resize-handle`, `editor`, `loading`, `empty` und `error`;
- Spalten erhalten sanitizte Part-Tokens wie `col-status`;
- Slots bleiben für strukturierte App-Inhalte zuständig.

Neue Shadow-DOM-CSS-Variablen benötigen nach Repo-Guideline vor der Implementierung eine eigene Bestätigung. Vorgeschlagene Minimalmenge:

| Variable | Zweck | vorgeschlagener Default |
| --- | --- | --- |
| `--nte-data-table-row-height` | funktionale feste Row Height | `2.5rem` |
| `--nte-data-table-resize-handle-width` | Pointer-Hit-Area des Separators | `0.5rem` |
| `--nte-data-table-background` | Surface | passender `--nt-*`-Fallback im `default-style()` |
| `--nte-data-table-border-color` | Grid-Linien | passender `--nt-*`-Fallback im `default-style()` |
| `--nte-data-table-focus-color` | sichtbarer Fokus | passender `--nt-*`-Fallback im `default-style()` |
| `--nte-data-table-selection-background` | Auswahl | passender `--nt-*`-Fallback im `default-style()` |

Funktionale Variablen liegen in `:host`; visuelle Baseline und Defaults bleiben im `default-style()`. Diese Liste ist Proposal, noch keine Freigabe.

## Dependencies, Paket und Skills

Bestehende Runtime-Bausteine:

- `lit`;
- `@nextrap/nt-core`;
- bestehender NTE Style Reset und Paket-Default-Style.

Für Phase 1A ist **keine neue Grid-Runtime-Abhängigkeit** vorgesehen. Sollte Phase 0 TanStack bestätigen, wird die Dependency ausschließlich im Root-Paket ergänzt und vor Implementierung separat freigegeben. Fremde Grid-Typen werden nicht exportiert.

Das Paket wird mit dem aktuellen Nx-/NTE-Generator angelegt und erhält:

- Root-`index.ts`, korrekte TypeScript-Pfadzuordnung und Vite-Demo-Einstieg;
- Vitest-Tests und browsernahe Vite-Demos entsprechend aktueller Repo-Konvention;
- Web-Types beziehungsweise vorhandene Metadatenintegration;
- die weiterhin verpflichtende, kurze und beispielorientierte `.ai-usage-info.md`;
- mitpublizierte `.agents`-Skills.

Paket-Skills:

1. `nte-data-table-usage`: Konfiguration, Array-/Connector-Modus, Slots, Height Contract, Accessibility und Beispiele.
2. `nte-data-table-theming`: Parts, CSS Properties, Default-Style und Links zurück zum Usage-Skill.
3. `nte-data-table-extensions`: eigene Connectoren, LayoutStores, Cell Types und Editoren; Abort/Race Handling, Schema-Migration, Datenschutz und Contract-Test-Matrix.

Der vollständige `.agents`-Ordner des Pakets wird über die bestehende Copy-/Publish-Pipeline ausgeliefert. Usage und Theming verlinken sich gegenseitig; Extensions verweist auf beide.

Programmatic und deklarative Nutzung verwenden denselben Light-DOM-Slot-Vertrag:

```ts
const table = document.createElement("nte-data-table");
// alternativ nach Definition: new NteDataTable()
table.configure(config);
table.append(searchInput, resultCount);
```

Die angehängten Elemente tragen dieselben `slot`-Attribute wie in deklarativem HTML.

## Roadmap

### Phase 0 – Entscheidungsspike

- Native State/DOM gegen TanStack-intern vergleichen.
- Öffentliche NTE-Verträge unverändert halten.
- DOM-/A11y-Smoke-Test, Bundle-Auswirkung und 2.000 × 20 Benchmark dokumentieren.
- Ergebnis vor Produktionsimplementierung bestätigen.

### Phase 1A – darstellbare Foundation

- Paket, Default Style, `.ai-usage-info.md` sowie Usage/Theming/Extensions-Skills.
- Column Schema, direkter Array-Modus und Async Read Connector.
- Sticky Header/Footer, begrenzter Scrollport, `scroll`-Layout.
- Resize, Start-/End-Pinning und Local-Storage-LayoutStore.
- Slots für Toolbar, Caption, Footer, Loading, Empty und Error.
- Search-State, Single-Sort, explizit konfigurierte Cell-/Row-Aktivierung und einfache Single-Selection.
- Ladezustand, Abort/Race Handling und typisierte Fehler.
- `table`/`grid`/`auto`, grundlegende Keyboard-Navigation und ARIA.
- Connector- und LayoutStore-Contract-Tests.
- Performance-Gate vor Beginn von Phase 1B.

### Phase 1B – interaktives MVP

- Text- und Select-Editing, Parser, Validator und Mutation.
- Rows-change-Vertrag für direkte Arrays.
- eigene Renderer-/Editor-/Cell-Type-Registrierung.
- Multi-Selection für Zeilen und Spalten.
- Multi-Sort.
- Column Reordering und Tastaturalternative.
- `fit`-Layout mit dokumentiertem Overflow-Fallback.
- pessimistische Pending-/Error-Anzeige für Connector-Editing.
- umfassende Keyboard-, RTL-, Zoom- und Forced-Colors-Tests.

### Phase 2 – produktive Erweiterungen

- typisierte Filter-API;
- API-gesteuerte Spaltensichtbarkeit;
- Row Reordering über Connector, inklusive Before/Success/Error-Events;
- Undo/Redo für lokale beziehungsweise bestätigte Edits;
- optionales Optimistic Editing mit Rollback-, Revision- und Konfliktvertrag;
- Autosize;
- serialisierbare View-Snapshots und App-Hooks;
- typisierte Live-Update-Erweiterung;
- Pagination-Komposition über Footer-Slot.

Serverseitige Saved Views, Freigaben und Berechtigungen bleiben Aufgabe der App oder eines Connectors, nicht des Tabellenkerns.

### Phase 3 – große Datenmengen

- feste Row Height und Row Virtualization mit Overscan;
- Range Reads mit Offset/Size und Cache;
- `scrollToRow` mit optionalem Locate-Adapter;
- Column Virtualization erst bei nachgewiesenem Bedarf;
- Worker-basierte lokale Suche/Sortierung nur nach Profiling;
- Screenreader-Modus beziehungsweise getestete Virtualisierungsstrategie.

### Phase 4 – Spreadsheet-Erweiterung

- Cell-/Range-Selection;
- Copy, Cut und Paste;
- Bulk Edit;
- Fill Handle;
- Summary-/Aggregation-Hooks;
- erweiterte Keyboard-Kommandos.

Formeln, Pivoting, Charts, Tree Data und konfigurierbare Menüs wären separate Produkte oder Plugins und sind nicht automatisch Teil von `nte-data-table`.

## Messbare Performance-Gates

Jeder Benchmark dokumentiert Browser-Version, Hardware, Viewport, Datenform, aktive DevTools und CPU-Throttling.

Referenzszenario vor Virtualisierung: 2.000 Zeilen × 20 einfache Text-/Zahlspalten.

- erste nutzbare Darstellung unter 1.000 ms;
- lokale Search-/Sort-Antwort unter 250 ms;
- kein Long Task über 100 ms während eines standardisierten Scroll-/Resize-Laufs;
- keine vollständige Zellneuberechnung bei reinem Resize;
- keine veraltete Connector-Antwort nach Query-Wechsel sichtbar.

Wenn das Gate verfehlt wird, wird Row Virtualization vor einer produktiven Phase 1B priorisiert. Marketing-Aussagen fremder Grids gelten nicht als NTE-Benchmark.

## Abnahmekriterien

### Phase 1A

- Ein SPA-Beispiel zeigt mindestens 2.000 Zeilen über Array- und Async-Connector.
- Header und Footer bleiben sichtbar, während nur der Datenbereich vertikal scrollt.
- Horizontales Scrollen ist im `scroll`-Modus möglich; zwei Start-Spalten bleiben gepinnt.
- Breiten sind per Pointer und Tastatur änderbar und werden mit stabilem Key wiederhergestellt.
- `layoutStore: null` und fehlender Persistenz-Key schreiben nichts dauerhaft.
- Search und Single-Sort funktionieren lokal und über Connector.
- Explizit konfigurierte Cell-/Row-Aktivierung und Single-Selection sind per Pointer und Tastatur erreichbar.
- Loading, Empty und Error sind per Default UI und Slot darstellbar.
- Host-Label oder Caption benennt den inneren semantischen Baum.
- Connector-/Store-Contract-Tests decken Abort, Race, beschädigte Snapshots und Schemaänderungen ab.
- Keine Menüs oder produktfremden Controls werden eingebaut.

### Phase 1B

- Text und Select können opt-in editiert, validiert, bestätigt und verworfen werden.
- Direkte Zeilenobjekte des Callers werden nicht mutiert.
- Connector-Mutationen zeigen Pending, Success und Error deterministisch.
- Zeilen und Spalten unterstützen konfigurierbare Multi-Selection.
- Multi-Sort und Column Reordering sind per API, Pointer und Keyboard erreichbar.
- `fit` verteilt freie Breite und fällt bei unvereinbaren Mindestbreiten auf Overflow zurück.
- Custom Cell Type und Custom LayoutStore sind ohne Änderung am Kern implementierbar.
- Grid-Tastaturmodell, RTL, 200-%-Zoom, Forced Colors und Fokusführung bestehen die Tests.

## Offene Entscheidungen für Review

1. Bestätigt Phase 0 den nativen State-Kern oder TanStack Table als interne Hilfe?
2. Soll Phase 1A bereits Multi-Selection enthalten, oder reicht die geplante Single-Selection bis Phase 1B?
3. Ist Row Reordering bei aktiver Sortierung immer gesperrt oder darf ein Connector eine explizite Policy liefern?
4. Soll der Default-`schemaKey` nur IDs oder zusätzlich eine von der App gesetzte Schema-Version enthalten? Der Vorschlag unterstützt beides und verwendet ohne Angabe die deterministische ID-Version.
5. Falls Virtualisierung vorgezogen wird: eigene Windowing-Schicht oder RevoGrid-Wrapper als gesonderter Entscheidungs-PR?
6. Wird die vorgeschlagene Minimalmenge neuer CSS-Variablen bestätigt, reduziert oder vollständig durch Parts und bestehende `--nt-*`-Tokens ersetzt?

## Implementierungsgrenze

Dieser PR enthält nur Proposal und API-Anhang. Nach Review und Freigabe folgt die Paketimplementierung in mehreren Dateien; entsprechend den Repo-Guidelines wird deren genauer Scope vor Beginn nochmals bestätigt.
