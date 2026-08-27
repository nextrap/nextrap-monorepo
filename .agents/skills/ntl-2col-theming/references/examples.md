# NTL 2Col Theme-Beispiele

Die Beispiele verwenden das `trunkjs/content-pane`-Kramdown-Format. Das Layout-Attribut erzeugt `ntl-2col`; eine Bereichsklasse wie `.aside` oder `.top` muss am direkten Light-DOM-Kind landen, damit die `data-query`-Zuordnung des Elements greift.

Hinweis zur Abstimmung: Wird ein gewünschter Bereich nur als „Header“ oder „Footer“ bezeichnet, kläre bei unklarer Position zuerst, ob tatsächlich die äußeren Slots oder die inneren Bereiche `top` und `bottom` gemeint sind.

## Standard: Überschrift über volle Breite

Der Standard nutzt `header` über die gesamte Breite und darunter nur `main` und `aside` im `wrapper`.

```markdown
## Behandlungsschwerpunkt
{: layout="ntl-2col.style-focus" section-style="--cols: 8;"}

Der Hauptinhalt bleibt im `main`-Bereich.

![Diagnostik](./diagnostik.jpg)
```

```scss
@use '@nextrap/ntl-2col' as twoCol;

ntl-2col.style-focus {
  @include twoCol.default-style();
}
```

Das Theme darf `::part(header)` gestalten, aber nicht auf eine der beiden Spaltenbreiten verkleinern.

## Bevorzugte Variante: Überschrift als Aside-Spalte

Wenn die Überschrift links neben dem Hauptinhalt stehen soll, wird sie als direktes `.aside`-Kind ausgegeben. `.reverse` stellt `aside` auf Desktop nach links und mobil vor `main`.

```markdown
## Behandlungsschwerpunkt
{: layout="ntl-2col.style-heading-column.reverse" .aside section-style="--cols: 8;"}

Der Hauptinhalt bleibt unverändert im `main`-Bereich und steht auf Desktop rechts neben der Überschrift.
```

```scss
@use '@nextrap/ntl-2col' as twoCol;

ntl-2col.style-heading-column {
  @include twoCol.default-style();

  &::part(aside) {
    align-self: flex-start;
  }
}
```

Falls der Kramdown-Generator Layout-Metadaten und Überschrift getrennt verarbeitet, muss das Ergebnis semantisch gleich bleiben: Die Überschrift ist ein direktes Kind von `ntl-2col` mit Klasse `.aside`; der Text bleibt ohne Slot-Zuweisung in `main`.

## Ausnahme: `top` als seitliche Überschriften-Spalte

Nutze diese Variante nur, wenn die Quelle die Überschrift bereits als `.top` ausgibt oder die Theme-Semantik den `top`-Bereich ausdrücklich verlangt. Weil ein leeres `aside` im internen Desktop-Layout sonst `main` auf volle Breite setzt, überschreibt das Theme die drei betroffenen Parts vollständig.

```markdown
## Behandlungsschwerpunkt
{: layout="ntl-2col.style-top-heading" .top section-style="--cols: 8;"}

Der Hauptinhalt bleibt im `main`-Bereich.
```

```scss
@use '@nextrap/ntl-2col' as twoCol;

ntl-2col.style-top-heading {
  @include twoCol.default-style();

  &[mode='desktop'] {
    &::part(wrapper) {
      flex-direction: row;
    }

    &::part(top) {
      order: 1;
      width: auto;
      flex: 1 1 0;
    }

    &::part(main) {
      order: 2;
      width: calc(100% * var(--cols, 8) / 12);
      flex: 0 0 calc(100% * var(--cols, 8) / 12);
    }
  }

  &[mode='mobile'] {
    &::part(wrapper) {
      flex-direction: column;
    }

    &::part(top) {
      order: 1;
      width: 100%;
      flex: 0 0 auto;
    }

    &::part(main) {
      order: 2;
      width: 100%;
      flex: 0 0 auto;
    }
  }
}
```

`header`, `wrapper` und `footer` werden in dieser Variante nicht verändert. Die seitliche Anordnung bleibt auf die Parts innerhalb des `wrapper` begrenzt.

## Review-Checkliste

- `header`, `wrapper` und `footer` nutzen die volle Containerbreite.
- `main` enthält weiterhin den Hauptinhalt.
- Standardvarianten verwenden nur `main` und `aside`.
- Desktop-Regeln sind auf `[mode='desktop']` begrenzt.
- Mobile `order` stellt die semantisch richtige Lesereihenfolge wieder her.
- Leere `aside`- oder optionale Slot-Zustände brechen das Layout nicht.
