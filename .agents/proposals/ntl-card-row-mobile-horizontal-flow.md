# `ntl-card-row` mobile horizontal flow

| Datum | Benutzername | Kurzbeschreibung |
| --- | --- | --- |
| 2026-09-05 | dermatthes | Erstfassung als Proposal für den ThemeJS2-Unify-Anwendungsfall. |
| 2026-09-05 | dermatthes | CSS-MVP, öffentliche Variablen und Content-Pane-Beispiel konkret umgesetzt. |

**Status:** Implementiert auf dem Proposal-Branch und bereit für Review. [geändert]

## § 1 Ziel und aktueller Blocker

`@nextrap/ntl-card-row` soll neben der sicheren mobilen Einzelspalte einen expliziten horizontalen Mobile-Flow anbieten. Das wird für chronologische Reihen, Kartenvergleiche und ähnliche Sequenzen benötigt, bei denen mehrere Karten als zusammenhängende Achse sichtbar bleiben sollen.

Aktuell setzt der funktionale Mobile-Contract im Shadow DOM jede Karte auf volle Breite und stapelt sie. Ein Theme darf diese Flex- und Breitenregeln laut Theming-Skill nicht überschreiben. Die Unify-Timeline in `leuffen/themejs2` kann deshalb desktopnah dargestellt werden, mobil aber nicht wie ihre horizontale Referenz.

→ Vereinfacht später `ntl-card-row`-Timeline-, Step-, Logo- und kompakte Vergleichsvarianten in Themes, ohne Shadow-DOM-Overrides oder eigene Carousel-Komponenten.

## § 2 Scope

- Opt-in Modifier `with-horizontal-flow` am `ntl-card-row`-Host; die mobile Einzelspalte bleibt unveränderter Default.
- Öffentliche Variable `--visible-cols-mobile` für die ungefähre Anzahl gleichzeitig sichtbarer Karten; Default `1.15`, damit die nächste Karte als Scroll-Hinweis angeschnitten bleibt.
- Horizontaler, touchfähiger Mobile-Flow mit `overflow-x: auto`, `scroll-snap-type: x proximity` und Snap-Items.
- Unveränderte Light-DOM-Reihenfolge und Semantik der enthaltenen Karten.
- Native horizontale Scrollbarkeit ohne eigene Controls, Methoden oder Events im ersten Implementierungsschritt. [geändert]
- Tablet/Desktop behalten das bestehende Zwölfspaltenmodell, sofern der Modifier nicht später ausdrücklich für weitere Modes erweitert wird.

Der MVP liegt vollständig in der äußeren SCSS-Schicht: Der vorhandene `main`-Part bildet die Scrollfläche, direkte `nte-card`-Kinder erhalten im Mobile-Modus die berechnete Basis. TypeScript und Shadow DOM bleiben unverändert. [neu]

## § 3 Non-Goals

- Kein eigener Slider mit Loop, Autoplay, Pagination oder duplizierten Karten.
- Keine neue `style-*`-Variante; Horizontal-Flow ist ein kombinierbares Layout-Feature.
- Keine Änderung des bestehenden `--cols`-Contracts für Desktop.
- Keine erzwungenen Controls, Icons oder visuellen Theme-Werte im Shadow DOM.
- Keine Media Queries im Package; der vorhandene responsive `mode` bleibt die Zustandsquelle.
- Keine Methoden- oder Event-API im CSS-MVP; externe Controls können bei nachgewiesenem Bedarf separat spezifiziert werden. [neu]

## § 4 Öffentliche API

### § 4.1 Modifier und CSS-Variablen

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

Das Mixin begrenzt Werte von `--visible-cols-mobile` unter `1` in der CSS-Berechnung auf eine Karte; es führt keine parallele `cols`-Attribut-API ein. [geändert]

### § 4.2 Parts und mögliche Folge-API

Die vorhandenen Parts `container`, `header`, `main` und `footer` bleiben bestehen. `main` ist im CSS-MVP die öffentliche Scrollfläche; ein zusätzlicher `scroller`-Part ist nicht erforderlich. [geändert]

```ts
interface NtlCardRowElement extends HTMLElement {
  scrollToItem(index: number, options?: ScrollIntoViewOptions): void;
  scrollByItem(delta: number, options?: ScrollIntoViewOptions): void;
}
```

Die skizzierte Methoden-API ist nicht Teil dieses PRs. Sie bleibt eine mögliche Folgeerweiterung, falls Themes nach der nativen Scroll-Implementierung nachweislich externe Controls benötigen. [geändert]

### § 4.3 Events und zugängliche Controls als Folgeoption

Ein optionales, bubbling und composed Event meldet nur stabile Indexänderungen, nicht jedes Scrollpixel:

```ts
type NtlCardRowActiveItemChangeDetail = {
  index: number;
  count: number;
  canScrollPrevious: boolean;
  canScrollNext: boolean;
};
```

Der Eventname wäre `ntl-card-row-active-item-change`; Event und Detailtyp werden im CSS-MVP nicht veröffentlicht. [geändert]

Der CSS-MVP erzeugt keine Shadow-DOM-Buttons und übernimmt keine Theme-Icons. Externe Buttons mit `aria-controls` werden erst zusammen mit einer späteren Methoden-API spezifiziert. [geändert]

### § 4.4 Implementiertes Content-Pane-Beispiel

```markdown
## Meilensteine
{: layout="ntl-card-row.with-horizontal-flow" section-style="--cols: 3; --visible-cols-mobile: 1.2; --horizontal-flow-gap: 16px;"}

### Analyse

Gemeinsames Zielbild definieren.

### Umsetzung

Lösung ausliefern und messen.
```

Das Beispiel zeigt mobil eine vollständige und einen Teil der nächsten Card; Desktop nutzt weiterhin drei von zwölf Spalten pro Card. [neu]

## § 5 Styling- und Responsive-Vertrag

- Die mobile Scrollrichtung und Snap-Logik wird über den öffentlichen `main`-Part gesetzt; die Item-Basis liegt auf den direkten Light-DOM-Cards und wird nur durch das opt-in Mixin aktiviert. [geändert]
- Farben, Typografie, Divider, Marker, Schatten und Control-Darstellung bleiben Theme-SCSS.
- Im Mobile-Modus dürfen Karten nicht mehr pauschal `100%` Breite erhalten, wenn der Modifier aktiv ist; ihre Basis wird aus `--visible-cols-mobile` berechnet.
- `min-inline-size: 0`, logische Eigenschaften und RTL-kompatibles Scrollen müssen berücksichtigt werden.
- Es gibt kein programmatisches Smooth Scrolling; native Scrollbarkeit und Snap benötigen deshalb keine Reduced-Motion-Sonderbehandlung. [geändert]

Die konkrete Implementierung verwendet ausschließlich das öffentliche Mixin, den vorhandenen `main`-Part und direkte Light-DOM-Cards. Ohne Modifier bleibt die mobile Einzelspalte unverändert. [neu]

## § 6 Abhängigkeiten und betroffene Verträge

- Änderung ausschließlich in `@nextrap/ntl-card-row`; keine neue Package-Abhängigkeit.
- `nte-card` bleibt unverändert und wird weiterhin als direktes Child verwendet.
- Der Theming-Skill erhält `with-horizontal-flow()` und die Theme-Grenzen.
- Der Usage-Skill, README, `.ai-usage-info.md`, Web-Types und die Content-Pane-Demo dokumentieren Modifier, Mixin und Variablen. [geändert]
- Package-Build und bestehende Tests sichern die SCSS-Integration; eine spätere Methoden-/Event-Erweiterung benötigt gesonderte RTL-, Keyboard- und dynamische-Child-Tests. [geändert]

## § 7 Entschiedene Fragen und Folgeoptionen

1. `--horizontal-flow-snap` ist öffentlich; Default bleibt `proximity`.
2. Der vorhandene `main`-Part ist die Scrollfläche; ein neuer Part entfällt.
3. Aktiver Index, Methoden, Event und externe Controls sind bewusst nicht Teil des CSS-MVPs.

Die Folgeoptionen bleiben in diesem Dokument erhalten, werden aber erst bei einem konkreten Consumer-Bedarf in einem separaten Proposal aktiviert. [geändert]

## § 8 Akzeptanzkriterien

- Ohne `.with-horizontal-flow` bleiben DOM, CSS-Ausgabe und mobile Einzelspalte unverändert.
- Mit Modifier zeigt Mobile mindestens eine vollständige und standardmäßig einen Teil der nächsten Karte, scrollt horizontal ohne Dokument-Overflow und snappt in logischer Reihenfolge.
- Desktop nutzt weiterhin das vorhandene Zwölfspaltenmodell und `--cols`.
- DOM-Reihenfolge sowie native Touch-, Trackpad- und RTL-Scrollbarkeit bleiben erhalten. [geändert]
- Mixin/Class-Parität, Usage-/Theming-Skills, `.ai-usage-info.md`, README, Demo und Web-Types sind im Implementierungs-PR vollständig aktualisiert. [geändert]
- Werte kleiner als `1` für `--visible-cols-mobile` erzeugen keine überbreite Karte. [neu]
- Die Unify-Timeline kann den mobilen Referenzflow anschließend ohne Theme-Override von Flex, Breite oder Shadow-DOM-Regeln umsetzen.
