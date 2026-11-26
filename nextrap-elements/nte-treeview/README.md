# NTE TreeView

Reaktiver Datei- und Seitenbaum mit einer Auswahl, unabhängig aufklappbaren
Unterbäumen und optionalen Zusatzspalten.

## Einstieg

```ts
import { NteTreeView, TreeModel } from '@nextrap/nte-treeview';

const tree = new TreeModel([
  {
    label: 'Handbuch',
    data: { expanded: true },
    children: [{ id: 'start', label: 'Einstieg', src: '/handbuch/einstieg' }],
  },
]);
const view = new NteTreeView();
view.ariaLabel = 'Inhalte';
view.setData(tree);
view.addEventListener('selection-change', ({ detail: node }) => {
  console.log(node); // Vollständiger Knoten aus tree.children, oder null.
});
document.body.append(view);

view.value = tree.children[0]; // Auswahl per Objekt; eine ID ist optional.
view.value = 'start';          // Alternativ per eindeutiger ID.
console.log(view.value);       // Der ausgewählte Knoten, nicht nur seine ID.
console.log(view.getState(tree.children[0])); // { selected: false, expanded: true }
```

Die Anwendung bindet die gewählte Variante als Sass-Mixin ein. Setze dafür
`style-filesystem` für Dateien und Ordner oder `style-website` für Seiten und
Unterseiten. Ohne eigene Style-Klasse setzt das Element `style-default`.
Das bisherige `default-style()`-Mixin entspricht `filesystem-style()`.

```scss
@use '@nextrap/nte-treeview' as treeview;

nte-treeview.style-filesystem {
  @include treeview.filesystem-style();
}
nte-treeview.style-website {
  @include treeview.website-style();
}
nte-treeview.style-default.with-zebra {
  @include treeview.with-zebra();
}
nte-treeview.style-sm {
  @include treeview.small-style();
}
nte-treeview.style-website-sm {
  @include treeview.website-small-style();
}
```

## Dateiliste statt vorgegebenem Baum

Wenn ein Server nur relative Dateipfade liefert, übernimmt die Library die
Baumgenerierung. Die folgende Alternative zum Einstieg benötigt keinen Adapter.

```ts
const tree = TreeModel.fromFileList([
  'index.md', 'docs/start.md', 'docs/api.md', '_sass/main.scss',
]);
view.setData(tree);

// Oder direkt an der View; der Rückgabewert ist das gebundene TreeModel.
const files = view.setFileList(['index.md', 'docs/start.md']);
view.value = 'docs/start.md';
console.log(files.children[1].children![0].data?.['path']); // docs/start.md
```

Dateien erhalten ihren vollständigen relativen Pfad als ID, Ordner eine ID mit
abschließendem Slash. `data.path` enthält den Pfad ohne abschließenden Slash;
`data.kind` ist `file` oder `directory`. Gemeinsame Ordner werden nur einmal
angelegt, identische Dateien werden zusammengefasst. Die Eingabereihenfolge
bleibt je Ebene erhalten. Leere, absolute, nicht normalisierte Pfade oder
Datei-/Ordnerkonflikte werden abgelehnt. Es werden keine Links erfunden.

## API und Darstellung

- `setData(tree)` bindet ein `TreeModel`. Änderungen über `tree.children` erscheinen reaktiv.
- `value` liest das ausgewählte Objekt oder `null`; der Setter nimmt dieses Objekt,
  eine vorhandene eindeutige ID oder `null` an.
- `selection-change` liefert bei einer geänderten Benutzer- oder API-Auswahl das
  Objekt direkt in `event.detail`. Derselbe Eintrag löst keinen weiteren Auswahlwechsel aus.
- `getNodeById(id)` findet einen Knoten; `getState(node)` liest `selected` und `expanded`.
- Ein optionaler `renderer(node)` liefert den Inhalt eines Eintrags. Ohne Renderer
  wird `node.label` dargestellt. Ein Lit-Template kann die bestehenden Slots
  `icon`, `center` und `end` befüllen.
- `src` macht die Beschriftung zu einem Link. `children` enthält Unterknoten;
  `data` enthält Darstellungszustände und primitive Zusatzdaten.
- Die TreeView ist kein Formularfeld. `value` ist eine JavaScript-Property;
  es gibt keine Formularübermittlung und keine Callback-Properties.

Verwende für Objektzugriffe die beobachtbaren Nodes aus `tree.children`,
`getNodeById` oder dem Event. Der Modell-Konstruktor kopiert seine Eingabedaten.
Ohne Datenmodell ist ein direkt geschriebener HTML-Baum möglich; dort liefert
`value` das ausgewählte `NteTreeViewItem`.

Der Pfeil öffnet und schließt nur den Unterbaum. Bei unverlinkten Ordnern toggeln
auch Name und Icon. Der erste einfache Klick auf einen noch nicht ausgewählten
verlinkten Ordner wählt ihn aus, der nächste folgt dem Link. Dateilinks navigieren
direkt. Auswahl, Hover und Fokus reichen über die gesamte Zeile einschließlich
Einzug und Zusatzspalten. Die Baseline hat keine Zelltrenner; `with-zebra`
aktiviert optionale Streifen.

## Öffnungszustand und Filter

`view.expandedState` liefert eine serialisierbare Momentaufnahme wie
`{ handbuch: true, archiv: false }`. Sie enthält Zweige mit eindeutiger ID.
Beim Austausch des Modells über `setData()` übernimmt dieselbe TreeView den
bisherigen Öffnungszustand für wiederkehrende IDs. Neue IDs verwenden den
Öffnungszustand aus dem übergebenen Modell.
Eine Zuweisung wie `view.expandedState = { handbuch: true, archiv: false }`
ändert die angegebenen Zweige. Die Zuweisung kann vor `setData()` erfolgen.
Ausgelassene IDs behalten ihren Zustand.

Die optionale Property `view.filter` prüft alle Modellknoten, auch in
geschlossenen Ordnern. Setze einen Callback, eine Wildcard oder eine Liste
von Wildcards (ODER). Jede Zuweisung ersetzt den bisherigen Filter.

```ts
view.filter = (node) => node.label.toLowerCase().includes('einstieg');
view.filter = '**/*.md';
view.filter = ['**/*.css', '**/*.scss'];
view.filter = undefined;
```

Muster ohne Slash prüfen den Namen, Muster mit Slash den vollständigen
Pfad (`data.path`, sonst die Label-Hierarchie). `*` steht für beliebig viele
Zeichen innerhalb eines Segments, `?` für ein Zeichen, `**` als ganzes
Pfadsegment für null oder mehr Ebenen. `**/*.md` erfasst somit auch
`index.md` im Wurzelverzeichnis. Die Muster sind case-sensitive;
Regex, Zeichenklassen und Negation sind nicht Teil dieser API.
Ein leerer String, eine leere Liste oder `undefined` entfernt den Filter.

Treffer und ihre Vorfahren bleiben sichtbar, Trefferpfade werden vorübergehend
geöffnet. Andere Nachfahren eines passenden Ordners werden nicht automatisch
eingeblendet. Auswahl und gespeicherter Öffnungszustand bleiben erhalten;
der Filter verändert keine Daten. Die Filterung gilt im Modellbetrieb.

## Beispiele

[Anwendungsabläufe und API-Vertrag](examples/README.md)

1. [Modell und gemeinsamer Renderer](demo/01-tree.demo.ts)
2. [Baum direkt in HTML](demo/02-file-explorer.demo.html)
3. [Auswahl und Zustand programmatisch auslesen](demo/03-actions.demo.ts)
4. [Optionale Zebra-Streifen](demo/04-zebra.demo.ts)
5. [Dateiliste, Filter und umschaltbare Normal-/Small-Styles](demo/05-file-list.demo.ts)

Die Demos importieren ihr Markup aus benachbarten HTML-Dateien mit `?raw` und
ihr SCSS mit `?inline`. Auch die funktionalen Shadow-DOM-Styles stehen in
separaten SCSS-Dateien. Theme-Styles bleiben in den öffentlichen Sass-Mixins.

Das Paket verwendet native Links und Disclosure mit Tab/Enter/Leertaste.
Sortierung per UI, Spaltenköpfe, Mehrfachauswahl, Virtualisierung und
Treegrid-Tastatursteuerung sind nicht Bestandteil dieser API.
