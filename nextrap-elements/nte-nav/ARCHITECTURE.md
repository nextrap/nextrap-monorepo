# NTE Nav 2 architecture

## Native Popover only

Die horizontale Submenu-Variante basiert vollständig auf dem nativen HTML
Popover-Mechanismus.

Ein `nte-nav-item` mit `submenu-popover` rendert intern ausschließlich
deklaratives Popover-Markup:

```html
<button popovertarget="submenu">...</button>
<div id="submenu" popover="auto">...</div>
```

Die Popover-Logik muss vom Browser kommen. `nte-nav` / `nte-nav-item` dürfen
keine JavaScript-Popover-Logik implementieren:

- kein `showPopover()`;
- kein `hidePopover()`;
- keine JS-Synchronisierung zwischen CSS-Orientation und Popover;
- keine Resize-/Media-Query-Logik für Popover.

Popover wird manuell durch das öffentliche `submenu-popover` Attribut am
betroffenen `nte-nav-item` aktiviert oder durch Entfernen dieses Attributs
deaktiviert.

## Vertikale Navigation

Die vertikale Variante darf kein Popover verwenden. Ein vertikales Submenu wird
korrekt gerendert, indem am betroffenen `nte-nav-item` **kein**
`submenu-popover` Attribut gesetzt wird.

Dann rendert `nte-nav-item` intern native Disclosure-Struktur:

```html
<details id="details" part="details">
  <summary id="disclosure" part="disclosure">...</summary>
  <div id="submenu" part="submenu" role="list">...</div>
</details>
```

Bei einem Elternpunkt mit eigenem `href` bleiben Link und Disclosure getrennt:

```html
<a id="link" part="link" href="...">...</a>
<details id="details" part="details">
  <summary id="toggle" part="toggle">...</summary>
  <div id="submenu" part="submenu" role="list">...</div>
</details>
```

Die vertikale Darstellung entsteht durch die `vertical()` SCSS-Variante. Sie
setzt die Navigationsrichtung auf Spalte und die Submenu-Position auf normalen
Dokumentfluss:

- `--nte-nav-flow: column`;
- `--nte-nav-submenu-position: static`;
- `--nte-nav-submenu-inline-size: 100%`;
- transparente Submenu-Fläche ohne Popover-Box, Border oder Shadow;
- optionaler Einzug über `--nte-nav-inline-submenu-indent`.

Das Submenu öffnet ausschließlich über den nativen `details[open]` Zustand. Die
CSS-Regel für `#details[open] #submenu` macht den Inhalt sichtbar und klappt die
Grid-Zeile von `0fr` auf `1fr` auf. Dadurch bleibt das Submenu inline unter dem
Elterneintrag und erweitert die Navigation vertikal, statt als Overlay aus dem
Layout herauszuspringen.

Wichtig: Für vertikale Navigation darf weder das öffentliche
`submenu-popover` Attribut noch intern `popover` oder `popovertarget` vorhanden
sein.

## CSS-Block- und Mixin-Dokumentation

Vor jedem zusammengehörigen CSS-Block und vor jedem SCSS-Mixin muss ein kurzer
Kommentar stehen, der seinen Zweck beschreibt. Der Kommentar muss erklären,
welches Verhalten der Block beziehungsweise das Mixin steuert und — falls
relevant — in welchem Zustand oder für welche Variante es gilt.

Ein Block umfasst dabei alle direkt zusammengehörigen Regeln eines Elements,
Parts oder Zustands. Einzelne CSS-Regeln innerhalb eines solchen Blocks
benötigen keinen eigenen Kommentar. Reine technische Folge- oder Reset-Regeln
können mit dem Kommentar des übergeordneten Blocks gruppiert werden.

Die Regel gilt insbesondere für:

- `:host`- und Komponentenblöcke;
- `::part(...)`-Blöcke;
- `:has(...)`-, Zustands- und Selektorblöcke;
- responsive beziehungsweise über `tj-responsive` gesetzte Zustände;
- jedes öffentliche SCSS-Mixin unter `src/scss/`.

Kommentare dürfen nicht nur den Selektor wiederholen. Sie müssen den
funktionalen Zweck des jeweiligen Blocks dokumentieren. Neue oder geänderte
zweckorientierte CSS-Blöcke und Mixins ohne Zweckkommentar sind nicht zulässig.

## Responsive Verhalten

Responsive Änderungen werden nicht über CSS-Media-Queries in SCSS umgesetzt.
Breakpoint-abhängige Zustände müssen über `tj-responsive` beziehungsweise
`@trunkjs/responsive`-Klassen und Attribute gesteuert werden. Das gilt sowohl
für die Umschaltung zwischen horizontaler und vertikaler Navigation als auch
für responsive Sichtbarkeit, Reihenfolge und Layout-Eigenschaften.

SCSS-Varianten dürfen ausschließlich die jeweils gesetzten Zustände stylen;
eine eigene `@media`-Regel oder eine parallele Breakpoint-Logik innerhalb von
`nte-nav` ist nicht zulässig.

## Styling und Style-Varianten

Das Shadow DOM enthält ausschließlich betriebsnotwendige Layout-, Disclosure-
und Popover-Regeln. Visuelle Defaults und Varianten werden außerhalb des Shadow
DOM über die öffentlichen Parts gestylt.

Die Default-Baseline wird im Mixin `default-style()` definiert. Neue visuelle
Varianten müssen dieses Mixin erweitern und unter `src/scss/styles/` angelegt
werden. Beispiel:

```scss
@use '../default-style' as default;

@mixin bordered-style() {
  @include default.default-style();

  & nte-nav-item::part(link),
  & nte-nav-item::part(disclosure) {
    border: var(--nt-border-width) solid var(--nt-border);
  }
}
```

Die Variante wird über eine eigene `style-*`-Klasse am Custom Element aktiviert
und muss die vollständige Default-Baseline über das Default-Mixin erben:

```scss
nte-nav.style-bordered {
  @include nav.bordered-style();
}
```

Dabei gelten folgende Regeln:

- Visuelles Styling immer über `::part(...)`, niemals durch zusätzliche
  visuelle Regeln im Shadow DOM.
- Globale Werte aus `@nextrap/style-base` über `--nt-*` Tokens beziehen.
- Komponentenvariablen nur für betriebsnotwendiges Verhalten verwenden, etwa
  Orientierung, Submenu-Positionierung und Animation.
- Eine Style-Variante wird als eigenes Mixin unter `src/scss/styles/` angelegt
  und in `index.scss` exportiert.
- Pro `nte-nav` darf nur eine `style-*`-Klasse gesetzt sein.
- Feature-Änderungen, die mit anderen Styles kombinierbar sein sollen, werden
  als `with-*` Modifier und nicht als neue `style-*`-Variante umgesetzt.
- Das Default-Mixin setzt für die Hauptnavigation keine Hintergrundfarbe. Das
  horizontale Dropdown erhält seine Hintergrundfarbe separat über
  `::part(submenu)`.
