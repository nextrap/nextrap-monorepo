# TreeView verwenden

Die Anwendung erstellt normalerweise ein `TreeModel` und arbeitet anschließend
mit dessen Knoten. Die folgenden Beispiele bauen aufeinander auf; die HTML-Variante
am Ende ist eine unabhängige Alternative.

## 01 – Einen Baum anzeigen

```ts
import { NteTreeView, TreeModel } from '@nextrap/nte-treeview';

const tree = new TreeModel([
  {
    label: 'Handbuch',
    data: { expanded: true },
    children: [
      { id: 'start', label: 'Einstieg', src: '/handbuch/einstieg' },
      { label: 'Notizen', data: { size: '4 KB', status: 'Entwurf' } },
    ],
  },
]);
const view = new NteTreeView();
view.ariaLabel = 'Inhalte';
view.setData(tree);
document.body.append(view);
```

`label` ist erforderlich; `id`, `src`, `children` und `data` sind optional.
Ohne eigenen Renderer erscheint die Beschriftung. `src` erzeugt einen echten
Link; `data.href` bleibt als bisheriger Fallback unterstützt. Ein gesetztes
`src` hat Vorrang, auch `src: ''` zum Entfernen eines vorhandenen Linkziels.

Die Anwendung bindet die visuelle Baseline einmal ein. `style-default` wird
automatisch gesetzt; der Sass-Import allein erzeugt kein CSS.

```scss
@use '@nextrap/nte-treeview' as treeview;

nte-treeview.style-default {
  @include treeview.default-style();
}
```

Der Pfeil klappt den Unterbaum um. Bei einem Ordner ohne Link tun das auch Name
und Icon. Der erste einfache Klick auf einen noch nicht ausgewählten verlinkten
Ordner wählt ihn aus; ein weiterer Klick folgt dem Link. Dateilinks und
modifizierte Linkklicks navigieren direkt. Freie Zeilenflächen und Zusatzspalten
lösen keine Auswahl aus; eigenständige Zellaktionen behalten ihre Funktion.

## 02 – Das ausgewählte Objekt erhalten und setzen

Ergänzt Beispiel 01. Ein normaler Event-Listener erhält den vollständigen Knoten.
Die Getter und Setter verwenden dieselbe Modellreferenz.

```ts
const handbook = tree.children[0];
const start = handbook.children![0];
const notes = handbook.children![1];

view.addEventListener('selection-change', ({ detail: node }) => {
  console.log(node);        // Vollständige Node; null beim Löschen der Auswahl.
  console.log(view.value);  // Dieselbe Referenz.
});

view.value = notes; // Notizen besitzt keine ID.
console.log(view.value === notes); // true
console.log(notes.data?.selected); // true

view.value = 'start'; // Alternativ per ID; der Getter liefert weiterhin die Node.
console.log(view.value === start); // true
console.log(view.getNodeById('start') === start); // true

view.value = null; // Auswahl löschen; event.detail ist null.
```

`selection-change` wird bei einer tatsächlichen Auswahländerung durch Klick oder
`value` ausgelöst und ist bubbling/composed. Modell und Item-Properties sind vor
dem Event synchronisiert; die sichtbare Markierung folgt im Renderzyklus.
Erneute Auswahl desselben Knotens erzeugt kein zweites
Event. Die anfängliche Modellbindung und direkte Zuweisungen an
`node.data.selected` erzeugen kein Auswahl-Event; verwende für interaktive
programmatische Auswahl `value`.

Der Konstruktor kopiert Eingabedaten. Verwende Nodes aus `tree.children`,
`getNodeById` oder dem Event, nicht Rohobjekte aus dem Konstruktor-Array.
Fremde oder entfernte Objekte werden vom Setter abgelehnt.

Eine ID ist nur für ID-Zugriffe nötig und muss dafür im gesamten Baum eindeutig
sein. `getNodeById('unbekannt')` liefert `null`; unbekannte Setter-IDs und
mehrdeutige IDs werfen einen Fehler, ohne die Auswahl zu ändern.
Ohne IDs funktionieren Objektzugriff und Rendering unverändert.

`value` ist kein HTML-Attribut. Die TreeView hat keine Formularbindung und
erzeugt keinen zusätzlichen `change`-Event.
Die [Aktionsdemo](../demo/03-actions.demo.ts) zeigt diese Aufrufe mit sichtbarer
Ausgabe. Ihr [HTML](../demo/03-actions.demo.html) enthält nur die Bedienoberfläche;
der ausgeführte TypeScript-Code wird nicht als zweiter String gepflegt.

## 03 – Den Öffnungszustand auslesen und ändern

Ergänzt Beispiel 02. `getState(node)` liefert einen Snapshot mit `selected`
und `expanded`, auch schon vor dem nächsten Rendern.

```ts
console.log(view.getState(handbook)); // { selected: false, expanded: true }

handbook.data!.expanded = false;
console.log(view.getState(handbook).expanded); // false

handbook.data!.expanded = true;
const openFolders = tree.children.filter((node) => view.getState(node).expanded);
console.log(openFolders.map((node) => node.label)); // ['Handbuch']
```

Ein Klick auf den Pfeil schreibt `data.expanded` ebenfalls zurück.
`getState` verändert den Zustand nicht und lehnt fremde oder entfernte Nodes ab.
Ein geschlossenes Elternverzeichnis behält die Zustände seiner Kinder.

## 04 – Zusätzliche Inhalte mit einem Renderer anzeigen

Ergänzt Beispiel 01. Es gibt einen Renderer für den gesamten Inhalt eines Eintrags.
Er erhält die Modell-Node und liefert Text oder ein Lit-Template. Zusätzliche
Inhalte können die vorhandenen Slots nutzen; die Beschriftung bleibt im Standard-Slot.

```ts
import { html } from 'lit';

view.renderer = (node) => html`
  ${node.label}
  <span slot="center">${node.data?.['size'] ?? ''}</span>
  <span slot="end">${node.data?.['status'] ?? ''}</span>
`;
```

Die Notizen erscheinen mit „4 KB“ und „Entwurf“ in gemeinsamen Zusatzspalten.
`data` wird nicht als HTML interpretiert. Individuelle Icons oder Zellaktionen
gehören bei Bedarf in denselben Renderer, etwa über `slot="icon"` oder
`slot="end"`. Die [Modelldemo](../demo/01-tree.demo.ts) zeigt einen ausführbaren
Renderer mit Statusauswahl.

Die folgende Sass-Variante ersetzt den Include aus Beispiel 01:

```scss
nte-treeview.style-default {
  @include treeview.default-style($indent: 1rem, $center-width: 6rem, $end-width: 9rem);
}
```

Gemeinsame Spaltenbreiten richten die Zellen über alle Ebenen aus. Der Einzug
belegt eine eigene Spalte; Hover und Auswahl reichen trotzdem bis zum linken
Rand des Baums. Bei schmalen Ansichten bestimmt die Anwendung passende
Zusatzspaltenbreiten. Das funktionale Shadow-DOM-SCSS liefert nur das Layout,
die visuelle Baseline kommt aus dem öffentlichen Mixin.

## 05 – Das Modell verändern oder ersetzen

Ergänzt Beispiel 02. Alle Änderungen laufen über das beobachtbare Modell.

```ts
handbook.label = 'Entwicklerhandbuch';
handbook.children!.push({ label: 'Anhang', data: { size: '2 KB' } });
handbook.children!.reverse();
notes.data!.status = 'Veröffentlicht';
```

Änderungen an Knoten, `data` und `children` aktualisieren die Ansicht.
Knoten ohne ID behalten beim Umsortieren unter demselben Elternpunkt ihre
Objektidentität. Optionale IDs bleiben stabil und müssen mindestens unter
Geschwistern eindeutig sein. Für ID-Zugriffe gilt zusätzlich die baumweite
Eindeutigkeit aus Beispiel 02. Der Baum muss azyklisch sein; jeder Knoten
gehört genau einem Elternpunkt.

Die folgende Bindung ersetzt das bisherige Modell:

```ts
view.setData(new TreeModel([{ label: 'Startseite', src: '/' }]));
await view.updateComplete;
```

Das alte Modell beeinflusst die Ansicht nicht mehr. Ein leerer `TreeModel()`
leert sie. `updateComplete` wartet auf die Erzeugung der Light-DOM-Einträge;
für deren eigene Shadow-Templates steht jeweils `item.updateComplete` bereit.

Nach `setData` verwaltet die TreeView ihre Light-DOM-Kinder. Manuelle
DOM-Änderungen gehören zur separaten HTML-Variante. `data` enthält
Darstellungsoptionen wie `expanded`, `selected`, `target`, `rel` und `current`
sowie primitive Zusatzwerte. Templates und DOM-Elemente gehören in den Renderer.
Der Server kann ein Wurzelknoten-Array mit diesem Vertrag direkt liefern;
andere Datenformate benötigen einen Adapter.

## 06 – Einen Baum direkt in HTML schreiben

Unabhängige Alternative zu Beispiel 01. Importiere `@nextrap/nte-treeview`
zur Registrierung und dieselbe Sass-Baseline. Kein `setData` ist nötig.
Das vollständige Beispiel steht in
[02-file-explorer.demo.html](../demo/02-file-explorer.demo.html);
[02-file-explorer.demo.ts](../demo/02-file-explorer.demo.ts) importiert es mit
`?raw` und das Demo-SCSS mit `?inline`.

Direkte `nte-treeview-item`-Kinder werden automatisch dem `children`-Slot
zugeordnet. Der Standard-Slot enthält den Namen, `icon` ein optionales Symbol
und `center`/`end` zusätzliche Zellen. Ordner erhalten ohne eigenes Icon ein
wechselndes Ordnersymbol. `href` erzeugt einen Link, `expanded` öffnet den Zweig.

Ergänzt das geladene HTML-Beispiel:

```ts
const htmlView = document.querySelector('nte-treeview')!;
const htmlItem = htmlView.querySelector('nte-treeview-item')!;

htmlView.addEventListener('selection-change', ({ detail: item }) => {
  console.log(item); // Das ausgewählte HTML-Item; null ohne Auswahl.
});
htmlView.value = htmlItem;
console.log(htmlView.value === htmlItem); // true, auch ohne HTML-id.
console.log(htmlView.getState(htmlItem));
```

Im HTML-Modus liefert `value` das Item selbst. Eine optionale HTML-`id`
ermöglicht dieselben ID-Zugriffe wie im Modellbetrieb.

## 07 – Optionale Zebra-Streifen aktivieren

Ergänzt die Baseline aus Beispiel 01. Es gibt keine Zeilen- oder Spaltentrenner.
Das zusätzliche Mixin stellt die optionale Klasse bereit:

```scss
nte-treeview.style-default.with-zebra {
  @include treeview.with-zebra();
}
```

```ts
view.classList.add('with-zebra');
```

Die Streifen folgen der sichtbaren Baumreihenfolge; geschlossene Zweige zählen
nicht mit. Hover und Auswahl haben Vorrang. Die
[Zebra-Demo](../demo/04-zebra.demo.ts) schaltet die Klasse über einen normalen
Event-Listener um. Links bleiben unterstrichen, Führungslinien bleiben über
den Zeilenflächen sichtbar und die Animationen berücksichtigen reduzierte Bewegung.

## Vorhandene Label-Ereignisse

Für Anwendungen, die eine Navigation oder eine Aktion am Label übernehmen,
bleiben `label-click` und `label-dblclick` erhalten. Ihr Detail ist
`{ item, originalEvent }`; sie sind bubbling/composed/cancelable.
`event.preventDefault()` auf `label-click` ersetzt Navigation beziehungsweise
Ordner-Toggle, die Auswahl bleibt erhalten. Ein nativer Doppelklick enthält
vorher zwei Klicks. Für die normale Auswertung der Auswahl genügt
`selection-change` aus Beispiel 02.
