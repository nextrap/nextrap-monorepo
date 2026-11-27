# ntl-columns

Responsives Layout mit Start-, Center- und End-Spalte für Content Pane.
Ohne Desktop-Klasse stehen die Inhalte untereinander.

## Verwendung

```ts
import '@nextrap/ntl-columns';
```

Importiere `@nextrap/ntl-columns`. Die Website stellt bei responsiven
Klassen `@trunkjs/responsive` und einen umgebenden `tj-responsive` bereit.

```markdown
# Seitenlayout
{: layout="ntl-columns" section-class="lg:desktop xxl:preserve-empty"}

## Hauptinhalt
{: section-style="--grid-cols: 6"}

Der normale Seiteninhalt.

## Hinweisbox
{: section-class="aside"}

Zusätzliche Informationen.
```

- Default-Slot: Center; `section-slot="start"` und `section-slot="end"`
  weisen Bereiche explizit zu. Direkte Kinder mit `.aside` ohne expliziten
  Slot landen automatisch in End.
- `desktop`: nebeneinander, sonst Start, Center, End untereinander.
- `reverse`: kehrt die sichtbare Reihenfolge auf beiden Achsen um.
- `preserve-empty`: behält auch leere Regionen bei.
- `d-none` auf einem zugewiesenen Kind zählt nicht als sichtbarer Inhalt.
- `--grid-cols` auf einem Kind setzt das Gewicht seiner Region; der erste
  sichtbare Inhalt mit positivem numerischem Wert gewinnt. Defaults 4:6:4.

## Breiten und leere Regionen

Die positiven Gewichte 4, 6 und 4 werden auf den verfügbaren Platz nach
Abzug der Abstände normiert. Sie sind keine festen Zwölftel: 4+6+4 ergibt
14. Bei eigenen Gewichten 2:8:2 entspricht die Aufteilung einem Zwölfer-Raster.
Verschwindet eine Region, teilen die verbleibenden Regionen den Platz
proportional. Mit nur Center erhält dieser 100 %.
Ein leerer Start-Slot wird mit `lg:desktop xxl:preserve-empty` erst ab XXL
als Platzhalter beibehalten.

`d-none` gilt für direkt zugewiesene Kinder; andere Klassen wie `hidden`
sind kein Signal zum Entfernen der Region. Dynamische Änderungen an Slots,
Klassen und Inline-Styles werden berücksichtigt. `preserve-empty` erhält
die Region, macht aber `d-none` nicht sichtbar. Reverse ändert die
visuelle, nicht die DOM- oder Tab-Reihenfolge.

## Theming

Parts: `wrapper`, `start`, `center`, `end`. Das Theme kann `--grid-cols`
direkt am jeweiligen Part setzen. Die funktionale Anordnung benötigt
kein Theme; das optionale Sass-Mixin stellt den Abstand ein.

```scss
@use '@nextrap/ntl-columns' as columns;

ntl-columns.style-default {
  @include columns.default-style(1rem);

  &::part(end) {
    --grid-cols: 3;
  }
}
```

## Demo und Entwicklung

`demo/base.demo.ts` zeigt im zentralen Demo Viewer Desktop, Reverse,
leere Spalten, responsive Sichtbarkeit und eigene Spaltengewichte.

```bash
npm run demo
npx nx build ntl-columns
```
