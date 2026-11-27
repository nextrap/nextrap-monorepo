# ntl-columns

Responsives Layout mit Start-, Center- und End-Spalte für Content Pane.
Ohne explizite Modus-Klasse schaltet das Layout automatisch ab `lg` um.

## Verwendung

```ts
import '@nextrap/ntl-columns';
```

Importiere `@nextrap/ntl-columns`. Die Website stellt bei responsiven
Klassen `@trunkjs/responsive` und einen umgebenden `tj-responsive` bereit.

```markdown
# Seitenlayout
{: layout="ntl-columns" section-class="lg:desktop xxl:preserve-empty" section-style="--center-cols: 6;"}

## Hauptinhalt

Der normale Seiteninhalt.

## Hinweisbox
{: section-class="aside"}

Zusätzliche Informationen.
```

- Default-Slot: Center; `section-slot="start"` und `section-slot="end"`
  weisen Bereiche explizit zu. Wenn End anfangs unbelegt ist, werden direkte
  Kinder mit `.aside` per `data-query` automatisch End zugewiesen.
- Ohne explizite Klasse schaltet `--breakpoint` (Default `lg`) automatisch
  zwischen gestapeltem Mobile- und horizontalem Desktop-Layout um.
  Zwei Werte wie `md, xl` ergeben zusätzlich `mode="tablet"` (gestapelt).
- `desktop` erzwingt horizontale Spalten, `mobile` erzwingt gestapelte
  Spalten; `mobile` hat Vorrang, falls beide Klassen gesetzt sind.
- `reverse`: kehrt die sichtbare Reihenfolge auf beiden Achsen um.
- `preserve-empty`: behält auch leere Regionen bei.
- Eine Region mit ausschließlich `d-none`-Elementen wird ausgeblendet,
  sofern kein `preserve-empty` gesetzt ist. Verwende elementbasierte Inhalte.
- `--start-cols`, `--center-cols` und `--end-cols` am Layout setzen die
  Spaltengewichte (Defaults 4:6:4). `--grid-cols` am Part überschreibt sie.

## Breiten und leere Regionen

Die positiven Gewichte 4, 6 und 4 werden auf den verfügbaren Platz nach
Abzug der Abstände normiert. Sie sind keine festen Zwölftel: 4+6+4 ergibt
14. Bei eigenen Gewichten 2:8:2 entspricht die Aufteilung einem Zwölfer-Raster.
Verschwindet eine Region, teilen die verbleibenden Regionen den Platz
proportional. Mit nur Center erhält dieser 100 %.
Ein leerer Start-Slot wird mit `lg:desktop xxl:preserve-empty` erst ab XXL
als Platzhalter beibehalten.

`d-none` gilt für direkt zugewiesene Elemente; andere Klassen wie `hidden`
sind kein Signal zum Entfernen der Region. CSS reagiert auf Klassenänderungen,
SlotVisibility auf Slotwechsel. Bei gemischtem rohem Text und ausgeblendeten
Elementen im Default-Slot kann CSS den Text nicht als eigenes Kind prüfen;
verwende deshalb HTML-Elemente beziehungsweise Content-Pane-Abschnitte.
`preserve-empty` erhält die Region, macht aber `d-none` nicht sichtbar.
Reverse ändert die visuelle, nicht die DOM- oder Tab-Reihenfolge.

## Theming

Parts: `wrapper`, `start`, `center`, `end`. Das Theme kann `--grid-cols`
direkt am jeweiligen Part setzen. Werte auf slotted Kindern können nicht
an den umgebenden Part vererbt werden. Die funktionale Anordnung benötigt
kein Theme; das optionale Sass-Mixin stellt den Abstand ein.
Das Theme kann `--breakpoint` global über einen Layout-Selektor oder direkt
an einer Instanz setzen. Der BreakPointMixin liest den wirksamen Wert bei
Initialisierung und Resize.

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
