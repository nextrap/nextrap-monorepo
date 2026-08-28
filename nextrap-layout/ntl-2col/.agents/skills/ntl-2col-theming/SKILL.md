---
name: ntl-2col-theming
description: Theme- und Component-Style-Klassen für @nextrap/ntl-2col entwickeln; beschreibt Parts, responsive Slot-Aufteilung und vorhandene SCSS-Mixins.
---

# NTL 2Col Theming

Nutze diesen Skill für Theme-SCSS und neue visuelle Varianten. Für Markup und Content-Zuordnung nutze `ntl-2col-usage`.

## Verbindlicher Slot-Vertrag

Behalte beim Seaming standardmäßig die eingebaute Content-Zuordnung bei:

- `main` enthält den Hauptinhalt.
- `aside` enthält den Inhalt der zweiten Spalte.
- `top` und `bottom` gehen innerhalb des `wrapper` über dessen volle Breite.
- `header` und `footer` liegen außerhalb des `wrapper` und bleiben über die volle Containerbreite.
- Verschiebe `header`, `wrapper` oder `footer` nicht per Grid oder Flex in nebeneinanderliegende Spalten.

Soll nur eine Überschrift links beziehungsweise seitlich stehen, ordne sie `aside` zu und verwende die vorhandene `.reverse`- beziehungsweise `.reverse-desktop`-Funktion. Erstelle dafür keine eigene `style-header-left`-Variante. Weitere Inhalte derselben Seitenspalte werden ebenfalls `aside` zugeordnet; der Hauptinhalt bleibt dadurch unabhängig in `main` erweiterbar.

Weiche von der Standardzuordnung nur für eine ausdrücklich verlangte, wiederverwendbare Sonderkomposition ab. Prüfe dabei immer die mobile Lesereihenfolge.

Entwickler sagen teilweise `header` oder `footer`, meinen aber `top` oder `bottom`. Wenn Position oder Ebene nicht eindeutig ist, frage: „Meinst du `header`/`footer` außerhalb oder `top`/`bottom` innerhalb des Wrappers?“

## Ausnahme: Content-Zuordnung im Theme überschreiben

Die automatischen Selektoren der benannten Slots können über CSS-Variablen ersetzt werden. Verwende diese Möglichkeit ausschließlich für eine ausdrücklich freigegebene, wiederverwendbare Sonderkomposition. Hole vor jeder Nutzung die Erlaubnis des Users ein. Normale Content-Zuordnung, `.reverse`, `.reverse-desktop`, Parts und CSS-Layout haben Vorrang.

| Zielbereich | Selektorvariable |
|---|---|
| `header` | `--ntl-2col-header-selector` |
| `top` | `--ntl-2col-top-selector` |
| `aside` | `--ntl-2col-aside-selector` |
| `bottom` | `--ntl-2col-bottom-selector` |
| `footer` | `--ntl-2col-footer-selector` |

Der unbenannte `main`-Slot besitzt absichtlich keine Selektorvariable. Ein Variablenwert ist ein CSS-Selektor oder eine kommaseparierte Selektorliste und wird ohne Anführungszeichen gesetzt:

```scss
.page-special-composition ntl-2col {
  --ntl-2col-top-selector: :scope > .header;
}
```

Dieses Beispiel verschiebt direkte `.header`-Kinder in den inneren `top`-Bereich. Sobald der Variablenselektor Elemente findet, ersetzt er für den Zielbereich die eingebaute Zuordnung. Soll die eigene Auswahl die Standardauswahl ergänzen, muss der Standardselektor in einer kommaseparierten Liste enthalten sein, zum Beispiel `--ntl-2col-top-selector: :scope > .special-top, :scope > .top;`.

Beachte bei jeder Freigabe:

- Prüfe die semantische Rolle und die mobile Lesereihenfolge, nicht nur die Desktop-Position.
- Vermeide Überschneidungen, bei denen dasselbe Light-DOM-Kind mehrere Selektorvariablen erfüllt.
- Fehlerhafte Selektoren werden per `console.error` gemeldet. Nur die fehlerhafte Alternative wird übersprungen; weitere Alternativen, die Standardzuordnung und andere Slots werden weiterhin verarbeitet.
- Die Selektoren werden beim ersten Update ausgewertet. Ein späteres Ändern der Variablen sortiert vorhandene Inhalte nicht erneut.
- Die Funktion benötigt eine Version von `@trunkjs/content-pane`, die `@var(...)` in `data-query` unterstützt.

## Theme-Regeln

- Binde die vollständige Baseline an genau eine `style-*` Klasse, normalerweise mit `default-style()`.
- Nutze vorhandene Mixins, bevor du eigenes `::part(...)`-Styling ergänzt.
- Erzwinge in der gemeinsamen Standard-Baseline keine vertikale Zentrierung oder sonstige `justify`-Ausrichtung. Standardmäßig bleiben `main` und `aside` ohne zusätzliches Justify-Override; wenn eine Ausrichtung gewünscht ist, muss sie im Theme bewusst ergänzt werden – entweder direkt in der jeweiligen `style-*`-Variante oder ausdrücklich über eine Modifier-Class.
- Wenn ein Theme eine eigene vertikale Ausrichtungslogik festlegt, wende sie innerhalb dieses Themes konsistent auf alle betroffenen `ntl-2col`-Varianten an statt nur auf einzelne Zufallsfälle.
- Feature-Klassen beginnen mit `with-*`; jede Style-Variante beginnt mit `style-*` und enthält ihre vollständige Baseline.
- Ändere Slot-Anordnung und Reihenfolge mit CSS, nicht mit TypeScript oder DOM-Umbauten.
- Scope Desktop-Regeln auf `[mode='desktop']` und stelle im Mobile-Modus die richtige Lesereihenfolge sicher.
- Definiere am `ntl-2col` keinen wiederkehrenden Abstand zu benachbarten Layouts und verlange dafür im Markup keine `py-*`, `my-*` oder `mt-*` Utilities. Dieser Content-Rhythmus gehört mit `--nt-spacing-section` in das umgebende Theme beziehungsweise den Content Container; die Komponente steuert nur interne Parts, Slots, Gaps und bewusst variant-spezifisches Padding.

Erstelle keine zusätzliche `style-*`-Variante nur für konfigurierbare Eigenschaften:

| Eigenschaft | Verwende stattdessen |
|---|---|
| Spaltenbreite | `--cols` pro Instanz, in Content Pane über `section-style` |
| Abstand zu anderen Layouts | Theme-Content-Flow mit `--nt-spacing-section` |
| Section-Fläche | `.surface-*` für Fläche und passende Textfarben; `.bg-*` für reinen Background |
| Reverse oder Breakout | vorhandene Modifier wie `.reverse`, `.reverse-desktop`, `.breakout-start`, `.breakout-end` |
| Vertikale Ausrichtung | nicht in die gemeinsame Standard-Baseline einbauen; nur bei Bedarf explizit im Theme setzen – bevorzugt direkt in der jeweiligen `style-*`-Variante über `::part(main)` und bei Bedarf `::part(aside)`, alternativ bewusst über eine Modifier-Class |
| Sticky Main | `.with-main-sticky-top`; Offset über `--main-sticky-top` |
| Wrapper-Background | `default-style($wrapper-bg-color: ...)` oder `with-wrapper-bg-color()` |
| Border oder Radius | `default-style()`, eine dokumentierte Variable oder ein kombinierbarer `with-*`-Modifier |

Eine weitere `style-*`-Variante ist nur gerechtfertigt, wenn sie eine vollständige, wiederverwendbare visuelle Baseline mit eigener Part-/Child-Darstellung und responsiver Komposition bildet, zum Beispiel ein echtes Hero-Layout. Eine einzelne Farbe, Breite oder Position genügt nicht.

## Parts und Variablen

Verfügbare Parts: `container`, `header`, `top`, `wrapper`, `main`, `aside`, `bottom`, `footer`.

Wichtige Layoutvariablen: `--breakpoint`, `--cols`, `--container-width`, `--gap` und `--inner-padding`. Die Selektorvariablen sind keine normale Layoutkonfiguration; für sie gelten die Freigaberegeln im vorherigen Abschnitt.

## Vorhandene Mixins

| Mixin | Zweck |
|---|---|
| `default-style()` | Vollständige visuelle Baseline |
| `with-reverse()` | `main` und `aside` umkehren |
| `with-alternating()` | Aufeinanderfolgende Layouts alternieren |
| `with-breakout-start()` / `with-breakout-end()` | Spalte zum Viewport-Rand erweitern |
| `with-image-auto-objectfit()` | Automatische Aside-Bilder einpassen |
| `with-justify($justify)` | vorhandenes Legacy-Mixin; nicht Teil der empfohlenen Standard-Baseline. Nur bewusst und explizit verwenden, wenn eine Modifier-Class oder eine projektweite Opt-in-Lösung gewünscht ist |
| `with-main-sticky-top($top)` | Kurzen Main-Content auf Desktop im Viewport halten |
| `with-background-and-divider()` | Hintergrund und Spaltentrenner |
| `with-wrapper-bg-color()` | Wrapper-Hintergrund setzen |
| `with-modifier-classes()` | Vorbereitete Modifier-Klassen registrieren |
