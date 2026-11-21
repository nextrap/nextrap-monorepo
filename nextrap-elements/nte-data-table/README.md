# @nextrap/nte-data-table

Renders a semantic native table from row objects and a typed `TableDefinition`, using `@nextrap/nte-table` for layout and interactions.

```ts
import '@nextrap/nte-data-table';
table.definition = { id: 'customers', rowId: 'id', columns: [{ id: 'name', header: 'Name', field: 'name' }] };
table.data = customers;
table.addEventListener('nte-data-table-view-state-change', ({ detail }) => save(detail.state));
```

Mit `definition.defaultSortable: false` wird die interaktive Sortierung standardmäßig für alle Spalten deaktiviert. `column.sortable` überschreibt diesen Tabellenstandard: `true` aktiviert eine einzelne Spalte, `false` deaktiviert sie. Ohne beide Angaben bleibt die Sortierung wie bisher aktiviert. Das Feature `sort` muss für interaktive Sortierung weiterhin eingeschaltet sein; programmatisch gesetztes `viewState.sort` bleibt unabhängig davon wirksam.

Spaltenbreiten: `width` akzeptiert Zahlen (Pixel), `'120px'`, `'20%'` und `'2fr'`. Zuerst werden Pixel reserviert; Prozent beziehen sich auf den danach verbleibenden Platz. `fr` verteilt den übrigen Platz gewichtet; ohne Breite gilt `'1fr'`. `minWidth`/`maxWidth` begrenzen Verteilung und Resizing. Überschüsse begrenzter fr-Spalten werden weiterverteilt, zu große Mindestbreiten erzeugen horizontalen Overflow. Ohne freie fr-Spalten bleibt Restfläche leer. Manuelle `viewState.columnWidths` überschreiben die Definition als Pixelwerte. Größenänderungen berechnen das Layout automatisch neu. Die Demos zeigen feste, prozentuale und flexible Spalten.

## Zeilen verschieben

Mit `features="reorder-rows"` lassen sich Zeilen über Drag-Handles verschieben.
`nte-data-table` aktualisiert seine `data`-Property mit einem neuen Array, ohne das
übergebene Array zu mutieren. Das Event `nte-data-table-row-reorder` liefert
`detail: { from, to, data }` mit nullbasierten Positionen und der neuen Reihenfolge.
Die Anwendung übernimmt `detail.data` in ihren Datenbestand; eigene Verschiebelogik
ist nicht nötig. Bei aktiver Sortierung beziehen sich die Positionen auf die
sichtbare Reihenfolge; die manuelle Reihenfolge ersetzt die Sortierung.

Die Drag-Vorschau der Basistabelle wird vor dem nächsten Lit-Render zurückgesetzt,
damit DOM-Zeilen und Zellwerte synchron bleiben. Das interne abbrechbare
`nte-table-row-reorder`-Event wird dafür von der Datentabelle behandelt; Anwendungen
verwenden das oben genannte Data-Table-Event.

## Eigene Zell-Renderer mit `dom`

`render` akzeptiert DOM-Nodes (auch `DocumentFragment`), aber keine Lit-`TemplateResult`s.
Mit `dom` aus `@trunkjs/browser-utils` lassen sich Lit-Templates direkt als Zellinhalt verwenden:

```ts
import { dom } from '@trunkjs/browser-utils';
import type { TableDefinition } from '@nextrap/nte-data-table';

type Vacation = { id: string; title: string };

// Der Handler erhält die Daten der angeklickten Zeile.
const edit = (row: Vacation): void => { console.log(row.id); };

const definition: TableDefinition<Vacation> = {
  id: 'vacations',
  rowId: 'id',
  columns: [
    { id: 'title', header: 'Titel', field: 'title' },
    {
      id: 'actions', header: 'Aktionen', sortable: false,
      render: (_value, row) => dom`<button type="button"
        aria-label=${`${row.title || 'Abwesenheit'} bearbeiten`}
        @click=${() => edit(row)}>Bearbeiten</button>`,
    },
  ],
};
```

Pro Renderer-Aufruf entsteht ein frisches Fragment. Beim Einfügen wandern dessen
Kinder in die Zelle; das Fragment ist danach leer. `dom` rendert einmalig und
bietet keine Update-API oder automatische Lifecycle-Verwaltung asynchroner
Lit-Directives. Die ausführbare Status-Renderer-Variante steht in
`demo/03-view-state.demo.ts`.

Complex values are properties, not attributes. `TableViewState` can be read with `getViewState()` and restored with `setViewState()`.

Leading columns support `pinned: true` defaults. Supplying `viewState.pinnedColumns` overrides them with stable column IDs; an empty array explicitly disables pinning. A column `footer` can be static content or a callback over the rendered rows and creates a fixed native footer row.
