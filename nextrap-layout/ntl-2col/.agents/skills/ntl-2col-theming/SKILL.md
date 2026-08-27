---
name: ntl-2col-theming
description: Theme- und Component-Style-Klassen für @nextrap/ntl-2col entwickeln; beschreibt Parts, responsive Slot-Aufteilung und vorhandene SCSS-Mixins.
---

# NTL 2Col Theming

Nutze diesen Skill für Theme-SCSS und neue visuelle Varianten. Für Markup und Content-Zuordnung nutze `ntl-2col-usage`.

## Theme-Regeln

- Binde die vollständige Baseline an genau eine `style-*` Klasse, normalerweise mit `default-style()`.
- Nutze vorhandene Mixins, bevor du eigenes `::part(...)`-Styling ergänzt.
- Feature-Klassen beginnen mit `with-*`; jede Style-Variante beginnt mit `style-*` und enthält ihre vollständige Baseline.
- Ändere Slot-Anordnung und Reihenfolge mit CSS, nicht mit TypeScript oder DOM-Umbauten.
- Scope Desktop-Regeln auf `[mode='desktop']` und stelle im Mobile-Modus die richtige Lesereihenfolge sicher.

## Layout-Grenzen

- `header`, `wrapper` und `footer` bleiben immer über die volle Containerbreite.
- Nur `top`, `main`, `aside` und `bottom` innerhalb des `wrapper` dürfen umgeordnet werden.
- Verwende standardmäßig `main` für Hauptinhalt und `aside` für die zweite Spalte.
- Soll eine Überschrift seitlich stehen, nutze bevorzugt `aside`; `top` als Spalte ist eine Ausnahme.

Entwickler sagen teilweise `header` oder `footer`, meinen aber `top` oder `bottom`. Wenn Position oder Ebene nicht eindeutig ist, frage: „Meinst du `header`/`footer` außerhalb oder `top`/`bottom` innerhalb des Wrappers?“

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
