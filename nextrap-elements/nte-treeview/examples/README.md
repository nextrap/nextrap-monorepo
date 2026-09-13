# Dateien und CMS-Seiten als Baum

## 01 – Seiten mit unabhängig aufklappbaren Unterseiten anzeigen

Dieses vollständige Beispiel zeigt eine klickbare Handbuchseite mit Unterseiten.
Der Pfeil klappt ausschließlich den Unterbaum auf und zu. Der Link bleibt dabei
bedienbar. Ein Knoten ohne `data.href` ist eine reine Beschriftung, etwa ein Verzeichnis;
auch dort bedient ausschließlich der Pfeil den Unterbaum.

```ts
import { NteTreeView, TreeModel } from '@nextrap/nte-treeview';

const tree = new TreeModel([
  {
    id: 'handbook', label: 'Handbuch',
    data: { href: '/handbuch', expanded: true },
    children: [{ id: 'start', label: 'Einstieg', data: { href: '/handbuch/einstieg' } }],
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
`children` und `data` sind optional. `data` bündelt `href`, `expanded`, `target`,
`rel`, `current` und individuelle primitive Zusatzwerte.
IDs sind unter Geschwistern eindeutig und bleiben stabil. Daten bilden einen
azyklischen Baum; jeder Knoten gehört genau einem Elternpunkt.

## 02 – Dateien ergänzen, umbenennen, verschieben und entfernen

Ergänzt Beispiel 01. Die folgenden Änderungen verwenden das beobachtbare `tree`.

```ts
tree.children[0].label = 'Entwicklerhandbuch';
tree.children[1].children!.push({
  id: 'notes', label: 'Notizen.md',
  data: { href: '/dateien/notizen.md', size: '4 KB', status: 'Entwurf' },
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

## 03 – Größen und Dropdowns in gemeinsamen Spalten anzeigen

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
Nur der Unterbaum erhält einen Start-Einzug mit automatischer Restbreite; kein
Padding verschiebt die volle Zeilenbreite über den rechten Rand.

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

## 04 – Einen Baum direkt als Markup schreiben

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
und `end` beliebige zusätzliche Inhalte. Zellaktionen sind keine Nachfahren
des Links oder des Aufklappknopfs. Auch manuell hinzugefügte/entfernte Knoten
aktualisieren den Pfeil. `expanded` lässt sich als Property oder Attribut setzen.

## 05 – Modell ersetzen und auf die Darstellung warten

Alternative zur bisherigen Datenbindung; ersetzt den Baum aus Beispiel 01.

```ts
view.setData(new TreeModel([{ id: 'home', label: 'Startseite', data: { href: '/' } }]));
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
`data` enthält Darstellungsoptionen und primitive Zusatzwerte; Templates gehören in die
Zellrenderer. Dasselbe Modell darf mehrere TreeViews versorgen; sie teilen auch
`data.expanded`. `expanded-change` wird direkt am Knoten mit Boolean-Detail ausgelöst,
bubbelt nicht und wird im Datenbetrieb automatisch ins Modell zurückgeschrieben.

## 06 – Serverseitige Bäume und individuelle Daten verwenden

Das Austauschformat ist ein verschachtelter Objektbaum mit `children`: `id`, `label` und `children` beschreiben die Struktur; `data` enthält
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
Austauschen oder Löschen des gesamten `data`-Objekts. Ohne `data` bleibt ein Knoten
eine Beschriftung und sein Unterbaum zunächst geschlossen; Aufklappen legt bei
Bedarf `data` an und schreibt `data.expanded` zurück. Für JSON ausschließlich
Strings, Zahlen, Booleans und `null` verwenden; optionale Werte dürfen fehlen.

Migration gegenüber dem bisherigen PR-Entwurf:

| Old | New |
|---|---|
| `node.href`, `node.expanded` | `node.data?.href`, `node.data?.expanded` |
| `node.target`, `node.rel`, `node.current` | `node.data?.target`, `node.data?.rel`, `node.data?.current` |
| `node.meta.size`, `node.meta.status` | `node.data?.['size']`, `node.data?.['status']` |
| `id`, `label`, `children` | unverändert auf Knotenebene |
