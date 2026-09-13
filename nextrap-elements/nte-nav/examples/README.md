# Navigationsbaum aus Daten

## 01 – Handbuch mit verlinkten Unterseiten anzeigen

Dieses vollständige Beispiel erzeugt eine Navigation. Der Text „Handbuch“ öffnet
die Übersichtsseite; der separate Pfeil klappt ihre Unterseiten auf. „Entwürfe“
hat keinen Link und öffnet seinen Inhalt über die ganze Zeile.

```ts
import { NavigationTree, NteNav } from '@nextrap/nte-nav';

const tree = new NavigationTree([
  {
    id: 'handbook', label: 'Handbuch', href: '/handbuch', expanded: true,
    children: [
      { id: 'start', label: 'Einstieg', href: '/handbuch/einstieg' },
      {
        id: 'api', label: 'API', href: '/handbuch/api',
        children: [
          { id: 'navigation', label: 'Navigation', href: '/handbuch/api/navigation' },
        ],
      },
    ],
  },
  {
    id: 'drafts', label: 'Entwürfe',
    children: [{ id: 'notes', label: 'Notizen', href: '/entwuerfe/notizen' }],
  },
]);

const nav = new NteNav();
nav.classList.add('with-tree');
nav.ariaLabel = 'Dokumentation';
nav.setData(tree);
document.body.append(nav);
```

Die App bindet einmal die Sass-Mixins ein. `style-default` wird automatisch gesetzt.

```scss
@use '@nextrap/nte-nav' as nav;

// Aktiviert das Baum-Feature innerhalb der visuellen Default-Baseline.
nte-nav.style-default.with-tree {
  @include nav.default-style();
  @include nav.with-tree();
}
```

`NavigationTree.children` enthält die Wurzeleinträge. Jeder
`NavigationTreeElement` besitzt eine stabile, unter Geschwistern eindeutige `id`
und ein `label`; `href` und `children` sind unabhängig voneinander optional.
`expanded` steuert native Inline-Untermenüs und folgt auch Benutzeraktionen.
`target`, `rel` und `current` werden an die vorhandene Link-API weitergegeben.

Das interaktive Beispiel `demo/06-tree.demo.ts` zeigt diese Bedienung mit Buttons.

## 02 – Namen ändern, Unterseiten ergänzen und verschieben

Die folgenden Abschnitte ergänzen Beispiel 01 und verwenden dessen `tree` und
`nav`. Alle Änderungen erfolgen am beobachtbaren Modell; ein weiteres `setData`
oder ein manueller Render-Aufruf ist nicht nötig.

```ts
tree.children[0].label = 'Entwicklerhandbuch';
tree.children[1].children!.push({
  id: 'release', label: 'Release-Plan', href: '/entwuerfe/release',
});
tree.children[1].expanded = true;
```

Die erste Zeile heißt danach „Entwicklerhandbuch“. Im geöffneten Ordner
„Entwürfe“ erscheinen „Notizen“ und „Release-Plan“.

```ts
// Ergänzt den vorigen Abschnitt: Der Release-Plan wechselt ins Handbuch.
const [release] = tree.children[1].children!.splice(1, 1);
tree.children[0].children!.push(release);

// Entfernt die verbliebenen Notizen; ein leerer Knoten zeigt keinen Öffnungspfeil.
tree.children[1].children!.splice(0);

// Fügt dem bisherigen Blatt wieder einen Zweig hinzu; der Pfeil erscheint automatisch.
tree.children[1].children!.push({ id: 'new', label: 'Neuer Entwurf', href: '/entwuerfe/neu' });
```

Auch das Ersetzen einer `children`-Liste und `reverse()` oder `sort()` sind
beobachtbar. Beim Umsortieren innerhalb desselben Elternpunkts erhalten stabile
IDs die zugehörigen DOM-Elemente. Beim Wechsel des Elternpunkts wird das Element
neu erzeugt; sein im Modell gespeicherter `expanded`-Zustand bleibt erhalten.
IDs werden nicht nachträglich geändert. Daten müssen einen azyklischen Baum
bilden; ein Knoten gehört jeweils zu genau einem Elternpunkt.

## 03 – Daten ersetzen und auf das Rendering warten

Dieser Abschnitt ist eine Alternative zum bisherigen Baum und ersetzt seine
Datenanbindung vollständig.

```ts
const replacement = new NavigationTree([
  { id: 'home', label: 'Startseite', href: '/' },
]);
nav.setData(replacement);
await nav.updateComplete;
```

Danach enthält das Light DOM nur den neuen Eintrag. Änderungen am vorherigen
`tree` beeinflussen diese Navigation nicht mehr. Ein leerer `NavigationTree()`
leert die Datenansicht. `nav.updateComplete` wartet auf das Shadow DOM der
Navigation und die erzeugten Light-DOM-Einträge; für deren innere Link- und
Disclosure-Templates kann zusätzlich das jeweilige `item.updateComplete`
abgewartet werden.

Der Konstruktor kopiert die Ausgangsdaten. Änderungen an ursprünglichen Arrays
oder extern gehaltenen, neu eingefügten Rohobjekten sind nicht beobachtbar;
greife nach dem Einfügen über `tree.children` auf die Knoten zu. Normale
Zuweisungen, Array-Methoden und `delete` werden beobachtet; `Object.defineProperty`
ist kein unterstützter Änderungsweg. Dasselbe Modell darf mehrere Navigationen
versorgen; dadurch teilen sie auch den Aufklappzustand. Entfernte Navigationen
melden ihren Listener ab und holen Änderungen beim erneuten Einhängen nach.

## 04 – Vorhandenes Markup und horizontale Navigation

Ohne `setData` bleibt die bestehende Verwendung mit selbst geschriebenen,
verschachtelten `nte-nav-item` unverändert. Auch diese Einträge können mit
`with-tree()` dargestellt werden; dabei darf kein `submenu-popover` gesetzt sein.
Der erste `setData`-Aufruf ersetzt alle bisherigen Light-DOM-Kinder. Im
Datenbetrieb gehört dieses Light DOM dem Renderer: Änderungen erfolgen am
Modell, nicht durch manuelles Ergänzen, Verschieben oder Entfernen von NavItems.
Insbesondere darf ein Element-Relocator die erzeugten Kinder nicht verschieben;
für mehrere Datenansichten wird dasselbe Modell an separate Navigationen gebunden.

Die Baumansicht ist eine vertikale Darstellung mit nativen Links und Disclosure,
kein ARIA-`tree`-Widget: Links und Summaries bleiben per Tab erreichbar;
Enter folgt dem Link, Enter oder Leertaste bedient die Summary.

`setData` ist unabhängig vom Styling. Für eine horizontale Datenansicht verwendet
die App das vorhandene `horizontal()`-Mixin und setzt bei den gewünschten
Elternpunkten `submenuPopover: true`. Im Datenbetrieb erfolgt keine automatische
Umschaltung anhand berechneter CSS-Werte. Der Browser bedient Popover ausschließlich
über das vorhandene deklarative Markup; `expanded` gilt nur für Inline-Untermenüs.
