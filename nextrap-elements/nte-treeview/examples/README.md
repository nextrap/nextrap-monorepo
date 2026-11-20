# Dateien und CMS-Seiten als Baum

Für Anwendungen ist `TreeModel` der übliche Einstieg: Die Anwendung arbeitet mit
Knoten aus `tree.children`, die TreeView übernimmt deren Darstellung. Ein direkt
in HTML aufgebauter Baum bleibt als zusätzliche Variante verfügbar.

## 01 – Seiten mit unabhängig aufklappbaren Unterseiten anzeigen

Dieses vollständige Beispiel zeigt eine klickbare Handbuchseite mit Unterseiten.
Der Pfeil klappt ausschließlich den Unterbaum auf und zu. Bei einem verlinkten
Elternknoten wählt der erste einfache Klick auf Name oder Icon nur den Eintrag
aus; ein weiterer Klick auf den bereits ausgewählten Eintrag öffnet den Link.
Dateilinks öffnen ihr Ziel direkt. Bei einem Knoten mit Kindern und ohne
Linkziel (`src` oder `data.href`), etwa einem Verzeichnis, öffnen und schließen auch Name und Icon den
Unterbaum. Bei Blättern wählt das Label den Eintrag aus; freie Zeilen- und
Zellflächen bleiben passiv. Eigenständige Zellaktionen wie Dropdowns behalten
ihre Funktion. Die Hervorhebung umfasst die gesamte Zeile mit ihren Zellen.

```ts
import { NteTreeView, TreeModel } from '@nextrap/nte-treeview';

const tree = new TreeModel([
  {
    id: 'handbook', label: 'Handbuch', src: '/handbuch',
    data: { expanded: true },
    children: [{ id: 'start', label: 'Einstieg', src: '/handbuch/einstieg' }],
  },
  { id: 'drafts', label: 'Entwürfe', children: [] },
]);
const view = new NteTreeView();
view.ariaLabel = 'Inhalte';
view.setData(tree);
document.body.append(view);
```

Die Anwendung bindet einmal die Sass-Baseline ein; `style-default` wird vom Element
automatisch gesetzt. `index.scss` selbst erzeugt kein CSS.

```scss
@use '@nextrap/nte-treeview' as treeview;

nte-treeview.style-default {
  @include treeview.default-style();
}
```

`TreeModel.children` enthält die Wurzelknoten. `TreeNode` benötigt `id` und `label`;
`src`, `children` und `data` sind optional. `src` rendert das Label als
`<a href="…">`; ohne Linkziel wird es ein Auswahlbutton. `data` bündelt `expanded`, `target`,
`rel`, `current`, `selected` und individuelle primitive Zusatzwerte.
IDs sind unter Geschwistern eindeutig und bleiben stabil. Daten bilden einen
azyklischen Baum; jeder Knoten gehört genau einem Elternpunkt.
`data.href` bleibt als bisheriger Linkzugriff unterstützt. Ein gesetztes `src`
hat Vorrang; `src: ''` entfernt das Linkziel auch bei vorhandenem `data.href`.
Änderungen an `node.src` aktualisieren den Link reaktiv.

## 02 – Die ausgewählte ID und die vollständige Node verwenden

Ergänzt Beispiel 01. `value` enthält die ID der ausgewählten Node oder `null`.
`selectedElement` liefert die vollständige Modell-Node, einschließlich `id`,
`label`, `src`, `children` und `data`. Beide Properties lassen sich setzen.

```ts
const handbook = tree.children[0];
const start = handbook.children![0];

// Benutzerauswahl: Der Event wird am TreeView ausgelöst, value enthält die ID.
view.addEventListener('change', (event) => {
  if (event.target !== view) return; // Zell-Inputs dürfen eigene change-Events auslösen.
  const id = view.value;
  const node = id === null ? null : view.getNodeById(id);
  console.log(id, node); // Bei Klick auf „Einstieg“: 'start' und exakt start.
});

// Dieser Handler reagiert zusätzlich auf Änderungen über die API-Setter.
view.onSelected = ({ node, item }) => {
  console.log(node); // Vollständige Modell-Node, oder null beim Löschen der Auswahl.
  console.log(item); // Gerendertes Element; vor dem Rendern gegebenenfalls null.
};

view.value = 'start';
console.log(view.value); // 'start'
console.log(view.getNodeById('start') === start); // true
console.log(view.selectedElement === start); // true
console.log(view.getState(start)); // { selected: true, expanded: false }
console.log(start.data?.selected); // true

view.selectedElement = handbook; // Alternativ direkt dieselbe Modell-Node setzen.
console.log(view.value); // 'handbook'; start ist nicht mehr ausgewählt.
view.value = null; // Beide Getter liefern jetzt null.
```

`value` ist eine JavaScript-Property, kein HTML-Attribut. Wie bei nativen
Form-Elementen löst eine Zuweisung allein kein `change` aus. Ein Benutzerwechsel
der Auswahl löst genau ein bubbling/composed `change` aus; erneutes Anklicken
desselben Eintrags nicht. Pfeile, Zellaktionen und modifizierte Linkklicks ändern
die Auswahl nicht. `onSelected` meldet Änderungen durch Benutzerauswahl sowie
`value`/`selectedElement`, nicht die anfängliche Modellbindung oder direkte
Zuweisungen an `data.selected`.

Der Modell-Konstruktor kopiert seine Eingabedaten. Verwende für Referenzzugriffe
Nodes aus `tree.children` oder einem Handler, nicht das ursprüngliche Objekt aus
dem Konstruktor-Array. Unbekannte, entfernte oder fremde Nodes werden vom
`selectedElement`-Setter und von `getState` abgelehnt.

Für `value`, `getNodeById` und Formularwerte müssen die verwendeten IDs im
**gesamten Baum eindeutig** sein. `getNodeById('unbekannt')` liefert `null`;
eine unbekannte ID im `value`-Setter oder eine mehrdeutige ID löst einen Fehler
aus und verändert die Auswahl nicht. Die Referenz-API bleibt für bestehende
Bäume mit nur unter Geschwistern eindeutigen IDs verfügbar.

## 03 – Die ausgewählte ID als Formularwert übernehmen

Ergänzt Beispiel 02. Die TreeView ist ein Form-associated Custom Element: Mit
`name` übermittelt sie die ausgewählte ID über die native Formularbindung.
Es ist kein Input pro Eintrag und kein verstecktes Ersatzfeld nötig.

```ts
const form = document.createElement('form');
view.name = 'selectedNode';
form.append(view);
document.body.append(form);

view.value = 'start';
console.log(new FormData(form).get('selectedNode')); // 'start'
console.log(view.getNodeById('start') === start); // true: die vollständige Node.

view.value = null;
console.log(new FormData(form).has('selectedNode')); // false: keine Auswahl.
```

Die Formularübermittlung enthält nur die ID. Die vollständigen Objektdaten bleiben
im TreeModel und werden über `getNodeById` oder `selectedElement` ausgelesen.
Alternativ zu einem umschließenden Formular unterstützt das Element das native
`form`-Attribut mit der ID eines Formulars. Die
[Aktionsdemo](../demo/03-actions.demo.ts) zeigt diesen Weg und gibt das Ergebnis
von `FormData` direkt aus, ohne Daten an einen Server zu senden.

Ohne `name`, ohne Auswahl oder bei deaktiviertem Baum wird kein Feld übertragen.
`disabled` und ein deaktiviertes umschließendes `fieldset` sperren die Bedienung;
programmatische Änderungen bleiben möglich. `form.reset()` stellt die bei
`setData` beziehungsweise beim ersten HTML-Anbinden vorgefundene Auswahl wieder
her, sofern der Knoten noch existiert, andernfalls keine Auswahl. Dabei entsteht
kein Benutzer-`change`.

Ein ausgewählter HTML-Knoten ohne ID oder eine mehrdeutige ausgewählte ID wird
nicht übermittelt. Bei gesetztem `name` meldet die native Formularvalidierung
diesen Zustand als Fehler. Die Referenz-API bleibt ohne Formularnamen nutzbar.

## 04 – Den Öffnungszustand eines Ordners auslesen

Ergänzt Beispiel 02. `getState(node)` liefert einen aktuellen Snapshot mit
`selected` und `expanded`; Änderungen erfolgen am Modell oder über `value`.

```ts
console.log(view.getState(handbook)); // { selected: false, expanded: true }

handbook.data!.expanded = false;
console.log(view.getState(handbook).expanded); // false, schon vor dem Rendern.

handbook.data!.expanded = true;
const folders = [handbook, tree.children[1]];
const openFolders = folders.filter((node) => view.getState(node).expanded);
console.log(openFolders.map((node) => node.label)); // ['Handbuch']
```

Auch ein Klick auf einen Ordnerpfeil schreibt den Öffnungszustand unmittelbar ins
Modell zurück. `getState` verändert weder Auswahl noch Öffnungszustand. Ein
geschlossenes Elternverzeichnis löscht die Zustände seiner Kinder nicht.

## 05 – Dateien ergänzen, umbenennen, verschieben und entfernen

Ergänzt Beispiel 01. Die folgenden Änderungen verwenden das beobachtbare `tree`.

```ts
tree.children[0].label = 'Entwicklerhandbuch';
tree.children[1].children!.push({
  id: 'notes', label: 'Notizen.md', src: '/dateien/notizen.md',
  data: { size: '4 KB', status: 'Entwurf' },
});
tree.children[1].data = { ...tree.children[1].data, expanded: true };
```

Das bisher leere Verzeichnis zeigt jetzt einen Pfeil und die Datei `Notizen.md`.
`data.expanded = false` blendet nur den Unterbaum aus, ohne Knoten zu löschen.

```ts
// Ergänzt den Ablauf: Die Datei wechselt in das Handbuch.
const file = tree.children[1].children!.pop()!;
tree.children[0].children!.push(file);

// Entfernt anschließend die verschobene Datei.
tree.children[0].children!.pop();
```

Das leere Verzeichnis verliert seinen Pfeil. Auch tiefe Zuweisungen,
`children = [...]`, `reverse()` und `sort()` aktualisieren die Ansicht.
Stabile IDs erhalten DOM-Knoten beim Umsortieren unter demselben Elternpunkt.
Beim Wechsel des Elternpunkts entstehen neue Elemente; der im Modell gespeicherte
Aufklappzustand bleibt erhalten.

## 06 – Größen und Dropdowns in gemeinsamen Spalten anzeigen

Ergänzt Beispiel 01. Zellrenderer erhalten den aktuellen `TreeNode` und liefern
Lit-Inhalte für dessen `center`- oder `end`-Slot. Die neuen `html`-/`nothing`-Imports
kommen aus Lit, einer Peer-Abhängigkeit des Pakets.

```ts
import { html, nothing } from 'lit';

tree.children[0].data = { ...tree.children[0].data, size: '12 KB', status: 'Entwurf' };
view.renderCenter = (node) => node.data?.['size'] ?? '';
view.renderEnd = (node) => node.data?.['status'] == null ? nothing : html`
  <select aria-label=${`Status für ${node.label}`}
    .value=${String(node.data['status'])}
    @change=${(event: Event) => {
      node.data!['status'] = (event.target as HTMLSelectElement).value;
    }}>
    <option>Entwurf</option>
    <option>Veröffentlicht</option>
  </select>`;
```

„12 KB“ erscheint zentriert in der mittleren Zusatzspalte, das Dropdown rechts.
Die Auswahl verändert nur `data.status`. Weder Link noch Aufklappzustand ändern
sich. Änderungen an `data` werden wie andere Modelldaten beobachtet.

Gemeinsame Breiten richten Zellen über alle Ebenen aus, auch bei leeren Zellen.
Die Default-Baseline reserviert Spalten nur, wenn entsprechende Slots existieren.
Eine eigene erste Grid-Spalte übernimmt den Einzug; Unterbäume und Highlights
behalten die volle Breite. Die gemeinsame Pfeilspalte richtet Datei- und
Ordner-Icons derselben Ebene aus.

Die folgende Sass-Variante **ersetzt** den Include aus Beispiel 01:

```scss
nte-treeview.style-default {
  @include treeview.default-style($indent: 1rem, $center-width: 6rem, $end-width: 9rem);
}
```

Zellbreiten und Tiefe benötigen Platz. Bei schmalen Ansichten entscheidet die App,
welche Zusatzspalten sie über ihre vorhandenen Responsive-Zustände ausblendet oder
verkleinert. Beliebig breite Zellinhalte werden nicht automatisch skaliert.
Ohne visuelle Sass-Baseline bleiben Slots nutzbar, erhalten aber keine gemeinsamen
Default-Spaltenbreiten. Es gibt keine Tabellen-/Treegrid-Tastatursteuerung.

## 07 – Einen Baum zusätzlich direkt als HTML schreiben

Unabhängige Alternative zu Beispiel 01. Importiere `@nextrap/nte-treeview` einmal
zur Registrierung und verwende dieselbe Sass-Baseline. Kein `setData` ist nötig.

```html
<nte-treeview aria-label="Dateien und Seiten">
  <nte-treeview-item href="/handbuch" expanded>
    Handbuch
    <span slot="center">12 KB</span>
    <select slot="end" aria-label="Status von Handbuch">
      <option>Entwurf</option>
      <option>Veröffentlicht</option>
    </select>
    <nte-treeview-item href="/handbuch/einstieg">
      Einstieg
      <span slot="end">Veröffentlicht</span>
    </nte-treeview-item>
  </nte-treeview-item>
  <nte-treeview-item>
    Dateien
    <nte-treeview-item href="/dateien/notizen.md">Notizen.md</nte-treeview-item>
  </nte-treeview-item>
</nte-treeview>
```

Direkte Knoten werden automatisch in den `children`-Slot eingeordnet. Der
Standard-Slot enthält die Beschriftung, `icon` ein optionales Symbol, `center`
und `end` beliebige zusätzliche Inhalte. Ohne eigenen `icon`-Inhalt verwenden
Elternknoten das automatisch wechselnde Ordnersymbol der Default-Styles. Blätter
behalten die gemeinsame Pfeilspalte, benötigen aber keinen DOM-Platzhalter und
ohne eigenes Icon auch keinen Symbolabstand. Zellaktionen sind keine Nachfahren
des Links oder des Aufklappknopfs. Auch manuell hinzugefügte/entfernte Knoten
aktualisieren den Pfeil. `expanded` lässt sich als Property oder Attribut setzen.

Auch bei HTML werden Handler programmatisch am TreeView registriert. Hier gibt
es kein Modell: `node` ist `null`, `item` ist der geklickte HTML-Knoten, und
`selectedElement` liefert beziehungsweise akzeptiert ein eigenes
`NteTreeViewItem`. Für `value` und `getNodeById` verwendet dieser Modus das
HTML-Attribut `id` des Eintrags.

Für einen ausgewählten HTML-Eintrag ohne `id` wirft der `value`-Getter einen
`RangeError`; `selectedElement` bleibt auch dann nutzbar.

```ts
const htmlView = document.querySelector('nte-treeview')!;
const htmlItem = htmlView.querySelector('nte-treeview-item')!;
htmlView.onClick = ({ item }) => console.log(item);
htmlView.onSelected = ({ item }) => console.log('Auswahl:', item);
htmlView.selectedElement = htmlItem;
console.log(htmlView.selectedElement === htmlItem); // true
console.log(htmlView.getState(htmlItem)); // { selected: true, expanded: true }
```

## 08 – Modell ersetzen und auf die Darstellung warten

Alternative zur bisherigen Datenbindung; ersetzt den Baum aus Beispiel 01.

```ts
view.setData(new TreeModel([{ id: 'home', label: 'Startseite', src: '/' }]));
await view.updateComplete;
```

Das alte Modell beeinflusst diese Ansicht nicht mehr. Ein leerer `TreeModel()`
leert sie. `view.updateComplete` wartet auf das Root-Shadow-DOM und die Erzeugung
der Light-DOM-Knoten; für deren eigene Shadow-Templates zusätzlich die jeweilige
`item.updateComplete` abwarten.

Der erste `setData`-Aufruf ersetzt alle vorhandenen Light-DOM-Kinder. Danach
verwaltet der Renderer diese Kinder; keine manuellen DOM-Änderungen oder Relocation.
Ohne `setData` bleibt das eigene Markup erhalten. Abgemeldete TreeViews lösen ihren
Modell-Listener und holen Änderungen beim erneuten Einhängen nach.

Der Konstruktor kopiert Ausgangsknoten und `data`. Änderungen erfolgen danach
über `tree.children`, auch bei neu eingefügten Rohobjekten. Normale Zuweisungen,
Array-Operationen und `delete` sind beobachtbar, `Object.defineProperty` nicht.
`src` enthält das optionale Linkziel; `data` enthält Darstellungsoptionen und
primitive Zusatzwerte; Templates gehören in die
Zellrenderer. Dasselbe Modell darf mehrere TreeViews versorgen; sie teilen auch
`data.expanded`. `expanded-change` wird direkt am Knoten mit Boolean-Detail ausgelöst,
bubbelt nicht und wird im Datenbetrieb automatisch ins Modell zurückgeschrieben.

## 09 – Serverseitige Bäume und individuelle Daten verwenden

Das Austauschformat ist ein verschachtelter Objektbaum mit `children`: `id`, `label`, `src` und `children` beschreiben Struktur und Linkziel; `data` enthält
individuelle Angaben. Serverseitige Modelle und andere Komponenten mit genau
diesem Vertrag können dieselben Knoten ohne strukturellen Umbau austauschen.
Dies ist eine gemeinsame Datenkonvention, kein universell normiertes Baumformat;
abweichende Feldnamen oder Datentypen anderer APIs benötigen einen Adapter.
Der Server liefert ein Array der Wurzelknoten an `new TreeModel(nodes)`.

Ergänzt Beispiel 01. Eine Icon-Kennung lässt sich wie ein Status hinzufügen,
ändern oder entfernen. Der Zellrenderer bestimmt ihre Darstellung:

```ts
tree.children[0].data = { ...tree.children[0].data, icon: '📖' };
view.renderCenter = (node) => node.data?.['icon'] ?? '';
tree.children[0].data['icon'] = '📚';
```

Die mittlere Zelle zeigt nun „📚“. `data.icon` wird nicht automatisch als HTML,
Bild-URL oder Icon-Bibliothek interpretiert. Für deklaratives Markup bleibt der
`icon`-Slot verfügbar. Alle Angaben in `data` werden reaktiv beobachtet, auch beim
Austauschen oder Löschen des gesamten `data`-Objekts. Ohne `data` bleibt der Unterbaum zunächst geschlossen; ein vorhandenes `src`
bleibt als Linkziel nutzbar. Name, Icon oder
Pfeil öffnen einen unverlinkten Unterbaum; dies legt bei Bedarf `data` an und
schreibt `data.expanded` zurück. Für JSON ausschließlich
Strings, Zahlen, Booleans und `null` verwenden; optionale Werte dürfen fehlen.

Migration gegenüber dem bisherigen PR-Entwurf:

| Old | New |
|---|---|
| `node.href`, `node.expanded` | `node.src` (bisheriges `node.data?.href` bleibt unterstützt), `node.data?.expanded` |
| `node.target`, `node.rel`, `node.current` | `node.data?.target`, `node.data?.rel`, `node.data?.current` |
| `node.meta.size`, `node.meta.status` | `node.data?.['size']`, `node.data?.['status']` |
| `id`, `label`, `children` | unverändert auf Knotenebene |

## 10 – Ordner- und Datei-Icons im Explorer verwenden

Ergänzt das deklarative Beispiel 07. Ordner mit Kindern zeigen ohne zusätzliche
Konfiguration ein geschlossenes oder geöffnetes Symbol aus `default-style()`.
Ein eigenes Element im `icon`-Slot ersetzt dieses Symbol. Dateien erhalten nur
dann ein Icon, wenn die Anwendung eines bereitstellt:

```html
<nte-treeview-item>
  <svg slot="icon" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    aria-hidden="true" focusable="false">
    <path d="M3 1.5h6l4 4v9H3z M9 1.5v4h4 M5 8h6 M5 10.5h6" />
  </svg>
  README.md
  <span slot="center">Markdown</span>
  <span slot="end">2 KB</span>
</nte-treeview-item>
```

Das SVG und der Name bilden gemeinsam die Klickfläche. Ein Blatt ohne Icon, etwa
`<nte-treeview-item>Methoden</nte-treeview-item>`, beginnt nach der gemeinsamen
Pfeilspalte, ohne einen zusätzlichen Symbolplatz zu reservieren. Datei- und
Ordner-Icons stehen auf derselben Achse; `--nt-space-3` trennt sie vom Text.
Links sind dauerhaft unterstrichen und die Führungslinien bleiben über Hover-
und Auswahlflächen sichtbar. Die unabhängige
[Explorer-Demo](../demo/02-file-explorer.demo.ts) zeigt offene und geschlossene
Ordner, Dateien mit und ohne Icon sowie Typ und Größe in gemeinsamen Spalten.

## 11 – Klick- und Doppelklick-Handler programmatisch setzen

Ergänzt das Modell aus Beispiel 01. Die Handler werden direkt auf `view` gesetzt;
sie erhalten dieselbe Node wie `tree.children` und die Zellrenderer. `item` ist
das zugehörige `NteTreeViewItem`, `originalEvent` der native Maus- oder
Tastaturklick auf Name oder Icon.

```ts
view.onClick = ({ node, item, originalEvent }) => {
  if (!node) return;
  console.log(node); // Vollständige Modell-Node, einschließlich children und data.
  console.log(node.src); // Zum Beispiel '/handbuch/einstieg'.
  console.log(item); // Die konkrete Darstellung dieser Node.

  // Diese Anwendung übernimmt Links; Ordner ohne Link behalten ihr Toggle.
  if (node.src ?? node.data?.href) originalEvent.preventDefault();
};

view.onDoubleClick = ({ node }) => {
  console.log('Öffnen:', node); // Zum Beispiel dieselbe Node start aus Beispiel 02.
};
```

`onClick` läuft vor der Standardaktion und Auswahl. `onSelected` aus Beispiel 02
läuft nach dem synchronen Abgleich von Modell und gerenderten Einträgen.
`originalEvent.preventDefault()` im Klick-Handler ersetzt Navigation oder
Ordner-Disclosure; der Eintrag wird weiterhin ausgewählt. Ein erneuter Klick auf
den ausgewählten Eintrag ruft `onClick` erneut auf, aber weder `onSelected` noch
`change`, solange sich die Auswahl nicht ändert.

Ein nativer Doppelklick enthält zuerst zwei Klicks; die TreeView verzögert diese
nicht. Deshalb verwendet die [Aktionsdemo](../demo/03-actions.demo.ts) sichtbare
Ausgaben statt blockierender Alerts. Ein Tastaturklick hat
`originalEvent.detail === 0`; bei Bedarf kann der Klick-Handler daran dieselbe
Öffnen-Aktion wie beim Doppelklick anschließen. Modifier-Klicks, Pfeile, freie
Zellflächen und eigenständige Slot-Aktionen rufen diese Label-Handler nicht auf.

Die bisherigen DOM-Events `label-click` und `label-dblclick` bleiben
bubbling/composed/cancelable und liefern unverändert `{ item, originalEvent }`
als `detail`. Die programmatischen Handler ergänzen dazu die Modell-Node.
Ein DOM-Listener kann weiterhin mit `event.preventDefault()` die
Standardaktion übernehmen. `selection-change` behält den ausgewählten
`NteTreeViewItem` als `detail`; beim Löschen der Auswahl meldet `onSelected`
stattdessen `{ node: null, item: null }`.
