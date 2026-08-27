---
name: ntl-2col-theming
description: Nutze diesen Skill beim Anlegen oder Ändern von Theme- und Component-Style-Klassen für @nextrap/ntl-2col; er erklärt Slot-Aufteilung, responsive Reihenfolge und vorhandene Mixins.
---

# NTL 2Col Theming

Lies zuerst `nextrap-layout/ntl-2col/.ai-usage-info.md`. Nutze [references/examples.md](references/examples.md), wenn Kramdown oder eine besondere Slot-Anordnung benötigt wird.

## Theme-Klassen

- Binde die vollständige Baseline an genau eine `style-*` Klasse, normalerweise mit `default-style()`.
- Nutze vorhandene Mixins, bevor du eigenes `::part(...)`-Styling ergänzt.
- Ändere Slot-Anordnung und Reihenfolge mit CSS, nicht mit TypeScript oder DOM-Umbauten.

## Layout-Regeln

- `header`, `wrapper` und `footer` bleiben immer über die volle Containerbreite.
- Nur `top`, `main`, `aside` und `bottom` innerhalb des `wrapper` dürfen umgeordnet werden.
- Verwende standardmäßig `main` für Hauptinhalt und `aside` für die zweite Spalte.
- Soll eine Überschrift seitlich stehen, nutze bevorzugt `aside`; `top` als Spalte ist eine Ausnahme.
- Nutze Flexbox-`order`, scope Desktop-Regeln auf `[mode='desktop']` und stelle mobil die richtige Lesereihenfolge wieder her.

Entwickler sagen teilweise `header` oder `footer`, meinen aber `top` oder `bottom`. Wenn Position oder Ebene nicht eindeutig ist, frage: „Meinst du `header`/`footer` außerhalb oder `top`/`bottom` innerhalb des Wrappers?“

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
