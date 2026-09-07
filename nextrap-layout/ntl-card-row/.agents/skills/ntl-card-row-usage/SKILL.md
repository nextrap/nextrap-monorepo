---
name: ntl-card-row-usage
description: "@nextrap/ntl-card-row korrekt importieren und in HTML oder trunkjs/content-pane Markdown mit flexiblen Card-Breiten verwenden."
---

# NTL Card Row Usage

Nutze diesen Skill für Markup, Content-Zuordnung und Card-Breiten. Für Theme-SCSS nutze `ntl-card-row-theming`.

## Import

```ts
import '@nextrap/ntl-card-row';
```

## HTML

```html
<ntl-card-row style="--cols: 3">
  <h2 slot="header">Cards</h2>
  <nte-card>Card 1</nte-card>
  <nte-card style="--cols: 6">Card 2</nte-card>
  <nte-card>Card 3</nte-card>
</ntl-card-row>
```

`--cols` am Row-Element gilt als Default für alle Cards. Ein Wert direkt an einer Card überschreibt diesen Default.

## Markdown

```markdown
## Cards
{: layout="ntl-card-row" section-style="--cols: 4;"}

### Optional row header
{: slot="header"}

### Card 1

Text

### Card 2
{: section-style="--cols: 6;"}

Breite Card
```

Nutze immer die `trunkjs/content-pane`-Notation `{: layout="..."}`. Die Default-Style-Klasse wird automatisch ergänzt, wenn keine `style-*` Klasse gesetzt ist.

## Verhalten

- Direkte Content-Sections werden als `nte-card`-Kinder gerendert.
- Desktop verwendet feste Breiten von `--cols: 1` bis `--cols: 12`.
- Ohne `--cols` an Row oder Card nutzt die Card die volle verfügbare Zeile.
- Eine Card-Breite wächst oder schrumpft nicht; überbreiter Inhalt wird abgeschnitten.
- Im Mobile-Modus stehen Cards standardmäßig untereinander in voller Breite.
- `.with-horizontal-flow` aktiviert opt-in eine nativ horizontal scrollbare mobile Reihe; Desktop verwendet weiterhin `--cols`.
- `--visible-cols-mobile` bestimmt dabei die sichtbare Kartenanzahl (Default `1.15`), `--horizontal-flow-gap` den Inline-Abstand und `--horizontal-flow-snap` die Snap-Stärke.
- `--min-width` und `--max-width` sind standardmäßig `unset`.
- `--gutter-x` und `--gutter-y` benötigen immer Längeneinheiten und dürfen nie als einheitsloses `0` gesetzt werden; verwende `0px`, `16px` oder andere echte Längenwerte.
- Verwende keine `cols`-Attribut-API.

## Horizontaler Mobile-Flow

```markdown
## Meilensteine
{: layout="ntl-card-row.with-horizontal-flow" section-style="--cols: 3; --visible-cols-mobile: 1.2; --horizontal-flow-gap: 16px;"}

### Analyse

Gemeinsames Zielbild definieren.

### Umsetzung

Lösung ausliefern und messen.
```

Der Modifier ändert weder die DOM-Reihenfolge noch den Desktop-Contract. Native Touch- und Trackpad-Interaktion funktioniert ohne zusätzliche Slider-Controls.
