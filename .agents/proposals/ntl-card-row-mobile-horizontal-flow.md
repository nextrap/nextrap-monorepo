# `ntl-card-row` mobile horizontal flow

**Status:** Draft for review. Do not implement before this proposal is approved.

## Ziel und aktueller Blocker

`@nextrap/ntl-card-row` soll neben der sicheren mobilen Einzelspalte einen expliziten horizontalen Mobile-Flow anbieten. Das wird für chronologische Reihen, Kartenvergleiche und ähnliche Sequenzen benötigt, bei denen mehrere Karten als zusammenhängende Achse sichtbar bleiben sollen.

Aktuell setzt der funktionale Mobile-Contract im Shadow DOM jede Karte auf volle Breite und stapelt sie. Ein Theme darf diese Flex- und Breitenregeln laut Theming-Skill nicht überschreiben. Die Unify-Timeline in `leuffen/themejs2` kann deshalb desktopnah dargestellt werden, mobil aber nicht wie ihre horizontale Referenz.

→ Vereinfacht später `ntl-card-row`-Timeline-, Step-, Logo- und kompakte Vergleichsvarianten in Themes, ohne Shadow-DOM-Overrides oder eigene Carousel-Komponenten.

## Scope

- Opt-in Modifier `with-horizontal-flow` am `ntl-card-row`-Host; die mobile Einzelspalte bleibt unveränderter Default.
- Öffentliche Variable `--visible-cols-mobile` für die ungefähre Anzahl gleichzeitig sichtbarer Karten; Default `1.15`, damit die nächste Karte als Scroll-Hinweis angeschnitten bleibt.
- Horizontaler, touchfähiger Mobile-Flow mit `overflow-x: auto`, `scroll-snap-type: x proximity` und Snap-Items.
- Volle Tastatur- und Screenreader-Nutzbarkeit der Light-DOM-Karten ohne Änderung ihrer DOM-Reihenfolge.
- Optionale Prev-/Next-Steuerung über eine kleine öffentliche Methoden- und Event-API; native horizontale Scrollbarkeit funktioniert auch ohne Controls.
- Tablet/Desktop behalten das bestehende Zwölfspaltenmodell, sofern der Modifier nicht später ausdrücklich für weitere Modes erweitert wird.

## Non-Goals

- Kein eigener Slider mit Loop, Autoplay, Pagination oder duplizierten Karten.
- Keine neue `style-*`-Variante; Horizontal-Flow ist ein kombinierbares Layout-Feature.
- Keine Änderung des bestehenden `--cols`-Contracts für Desktop.
- Keine erzwungenen Controls, Icons oder visuellen Theme-Werte im Shadow DOM.
- Keine Media Queries im Package; der vorhandene responsive `mode` bleibt die Zustandsquelle.

## Vorgeschlagene öffentliche API

### Modifier und CSS-Variablen

```scss
ntl-card-row.with-horizontal-flow {
  @include cardRow.with-horizontal-flow();
}
```

```markdown
## Meilensteine
{: layout="ntl-card-row.with-horizontal-flow" section-style="--cols: 2; --visible-cols-mobile: 1.35;" }

### 2026

Erster Meilenstein

### 2025

Zweiter Meilenstein
```

| API | Typ / Default | Zweck |
| --- | --- | --- |
| `.with-horizontal-flow` | Modifier-Class | Aktiviert den horizontalen Flow ausschließlich als Opt-in. |
| `with-horizontal-flow()` | SCSS-Mixin | Bindet die Class-unabhängige Feature-Implementierung an einen Theme-Selector. |
| `--visible-cols-mobile` | positive Zahl, `1.15` | Bestimmt die mobile Kartenbasis als `100% / Wert`; Werte kleiner als `1` werden verworfen. |
| `--horizontal-flow-gap` | Länge, Fallback `var(--gutter-x)` | Erlaubt einen eigenen Inline-Abstand, ohne den vertikalen Gutter umzudeuten. |
| `--horizontal-flow-snap` | `none \| proximity \| mandatory`, `proximity` | Steuert die Scroll-Snap-Stärke. |

Die Komponente validiert ungültige Variablen über sichere CSS-Fallbacks; sie führt keine parallele `cols`-Attribut-API ein.

### Parts und Methoden

Die vorhandenen Parts `container`, `header`, `main` und `footer` bleiben bestehen. Falls die Scrollfläche nicht eindeutig über `main` thematisierbar ist, wird ausschließlich dafür ein zusätzlicher Part `scroller` vorgeschlagen.

```ts
interface NtlCardRowElement extends HTMLElement {
  scrollToItem(index: number, options?: ScrollIntoViewOptions): void;
  scrollByItem(delta: number, options?: ScrollIntoViewOptions): void;
}
```

Die Methoden fokussieren nicht automatisch und verändern die DOM-Reihenfolge nicht. Außerhalb von `with-horizontal-flow` sind sie No-ops mit klar dokumentiertem Rückgabeverhalten.

### Events und zugängliche Controls

Ein optionales, bubbling und composed Event meldet nur stabile Indexänderungen, nicht jedes Scrollpixel:

```ts
type NtlCardRowActiveItemChangeDetail = {
  index: number;
  count: number;
  canScrollPrevious: boolean;
  canScrollNext: boolean;
};
```

Eventname: `ntl-card-row-active-item-change`.

Autoren können externe Buttons mit `aria-controls` verwenden und darüber `scrollByItem(-1)` beziehungsweise `scrollByItem(1)` aufrufen. Die Komponente erzeugt keine unbeschrifteten Shadow-DOM-Buttons und übernimmt keine Theme-Icons.

## Styling- und Responsive-Vertrag

- Die funktional notwendige mobile Scrollrichtung, Item-Basis und Snap-Logik liegt im Package-Shadow-DOM und wird nur durch den Opt-in-Modifier aktiviert.
- Farben, Typografie, Divider, Marker, Schatten und Control-Darstellung bleiben Theme-SCSS.
- Im Mobile-Modus dürfen Karten nicht mehr pauschal `100%` Breite erhalten, wenn der Modifier aktiv ist; ihre Basis wird aus `--visible-cols-mobile` berechnet.
- `min-inline-size: 0`, logische Eigenschaften und RTL-kompatibles Scrollen müssen berücksichtigt werden.
- `prefers-reduced-motion` wirkt nur auf programmatisches Smooth Scrolling; native Scrollbarkeit und Snap bleiben nutzbar.
- Fokus darf beim horizontalen Scrollen weder verloren gehen noch außerhalb der sichtbaren Scrollfläche abgeschnitten werden.

## Abhängigkeiten und betroffene Verträge

- Änderung ausschließlich in `@nextrap/ntl-card-row`; keine neue Package-Abhängigkeit.
- `nte-card` bleibt unverändert und wird weiterhin als direktes Child verwendet.
- Der Theming-Skill erhält `with-horizontal-flow()` und die Theme-Grenzen.
- Der Usage-Skill, README, `.ai-usage-info.md`, Web-Types und die Content-Pane-Demo dokumentieren Modifier, Variablen, Methoden und Event.
- Tests decken Mobile-, Desktop-, RTL-, Keyboard- und dynamische Child-Änderungen ab.

## Offene Fragen

1. Soll der aktive Index das erste vollständig sichtbare oder das der Scrollmitte nächste Item bezeichnen?
2. Reicht `scroll-snap-type: proximity` als fester Contract oder soll `--horizontal-flow-snap` öffentlich sein?
3. Soll ein eigener `scroller`-Part ergänzt werden oder ist `main` als vorhandener Part semantisch ausreichend?
4. Müssen externe Controls über ein deklaratives Target-Protokoll angebunden werden, oder genügt die Methoden-API für den ersten Schritt?

## Akzeptanzkriterien

- Ohne `.with-horizontal-flow` bleiben DOM, CSS-Ausgabe und mobile Einzelspalte unverändert.
- Mit Modifier zeigt Mobile mindestens eine vollständige und standardmäßig einen Teil der nächsten Karte, scrollt horizontal ohne Dokument-Overflow und snappt in logischer Reihenfolge.
- Desktop nutzt weiterhin das vorhandene Zwölfspaltenmodell und `--cols`.
- Alle Karten bleiben per Tastatur erreichbar; sichtbarer Fokus wird nicht abgeschnitten.
- RTL-Reihenfolge und programmatisches Scrollen sind getestet.
- Hinzufügen oder Entfernen direkter Karten aktualisiert Count, Grenzen und aktiven Index ohne Neuinitialisierung.
- Mixin/Class-Parität, Usage-/Theming-Skills, `.ai-usage-info.md`, README, Demo, Web-Types und Unit-Tests sind im Implementierungs-PR vollständig aktualisiert.
- Die Unify-Timeline kann den mobilen Referenzflow anschließend ohne Theme-Override von Flex, Breite oder Shadow-DOM-Regeln umsetzen.
