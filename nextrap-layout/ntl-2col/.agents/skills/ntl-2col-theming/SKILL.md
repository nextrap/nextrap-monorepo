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

## Theme-Regeln

- Binde die vollständige Baseline an genau eine `style-*` Klasse, normalerweise mit `default-style()`.
- Nutze vorhandene Mixins, bevor du eigenes `::part(...)`-Styling ergänzt.
- Feature-Klassen beginnen mit `with-*`; jede Style-Variante beginnt mit `style-*` und enthält ihre vollständige Baseline.
- Ändere Slot-Anordnung und Reihenfolge mit CSS, nicht mit TypeScript oder DOM-Umbauten.
- Scope Desktop-Regeln auf `[mode='desktop']` und stelle im Mobile-Modus die richtige Lesereihenfolge sicher.

Erstelle keine zusätzliche `style-*`-Variante nur für konfigurierbare Eigenschaften:

| Eigenschaft | Verwende stattdessen |
|---|---|
| Spaltenbreite | `--cols` pro Instanz, in Content Pane über `section-style` |
| Section-Fläche | `.surface-*` für Fläche und passende Textfarben; `.bg-*` für reinen Background |
| Reverse oder Breakout | vorhandene Modifier wie `.reverse`, `.reverse-desktop`, `.breakout-start`, `.breakout-end` |
| Vertikale Ausrichtung | vorhandene Modifier wie `.with-main-justify-center` |
| Wrapper-Background | `default-style($wrapper-bg-color: ...)` oder `with-wrapper-bg-color()` |
| Border oder Radius | `default-style()`, eine dokumentierte Variable oder ein kombinierbarer `with-*`-Modifier |

Eine weitere `style-*`-Variante ist nur gerechtfertigt, wenn sie eine vollständige, wiederverwendbare visuelle Baseline mit eigener Part-/Child-Darstellung und responsiver Komposition bildet, zum Beispiel ein echtes Hero-Layout. Eine einzelne Farbe, Breite oder Position genügt nicht.

## Parts und Variablen

Verfügbare Parts: `container`, `header`, `top`, `wrapper`, `main`, `aside`, `bottom`, `footer`.

Wichtige Variablen: `--breakpoint`, `--cols`, `--container-width`, `--gap` und `--inner-padding`.

## Vorhandene Mixins

| Mixin | Zweck |
|---|---|
| `default-style()` | Vollständige visuelle Baseline |
| `with-reverse()` | `main` und `aside` umkehren |
| `with-alternating()` | Aufeinanderfolgende Layouts alternieren |
| `with-breakout-start()` / `with-breakout-end()` | Spalte zum Viewport-Rand erweitern |
| `with-image-auto-objectfit()` | Automatische Aside-Bilder einpassen |
| `with-background-and-divider()` | Hintergrund und Spaltentrenner |
| `with-wrapper-bg-color()` | Wrapper-Hintergrund setzen |
| `with-modifier-classes()` | Vorbereitete Modifier-Klassen registrieren |
