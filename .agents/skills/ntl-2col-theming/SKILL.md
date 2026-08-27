---
name: ntl-2col-theming
description: Erstellt oder prüft Themes und Kramdown-Layouts für @nextrap/ntl-2col, insbesondere bei seitlich angeordneten Überschriften und responsiver Slot-Reihenfolge.
---

# NTL 2Col Theming

Nutze diesen Skill, wenn ein Theme oder ein generiertes Kramdown-Layout die Bereiche von `ntl-2col` anordnet oder visuell gestaltet.

Lies zuerst `nextrap-layout/ntl-2col/.ai-usage-info.md`. Für konkrete Markup- und SCSS-Muster lies zusätzlich [references/examples.md](references/examples.md).

## Struktur beibehalten

Das Element hat zwei Layout-Ebenen:

1. `header`, `wrapper` und `footer` liegen direkt im `container`.
2. `top`, `main`, `aside` und `bottom` liegen innerhalb des `wrapper`.

`header`, `wrapper` und `footer` bleiben immer über die gesamte Containerbreite. Verschiebe sie nicht in das zweispaltige Layout und begrenze ihre Breite nicht auf eine Spalte.

Alle seitlichen Anordnungen und Umordnungen finden ausschließlich innerhalb des `wrapper` statt. `main` behält dabei immer den Hauptinhalt.

## Begriffe eindeutig klären

Entwickler sagen im Gespräch teilweise `header` oder `footer`, meinen aber den inneren `top`- beziehungsweise `bottom`-Bereich. Übernimm diese Bezeichnungen nicht ungeprüft:

- `header` und `footer` liegen außerhalb des `wrapper` und bleiben über die gesamte Breite.
- `top` und `bottom` liegen innerhalb des `wrapper` und können Teil einer dortigen Umordnung sein.
- Wenn aus Anforderung, Beispiel oder gewünschter Position nicht eindeutig hervorgeht, welcher Bereich gemeint ist, frage vor der Umsetzung nach: „Meinst du wirklich `header`/`footer` außerhalb des Wrappers oder `top`/`bottom` innerhalb des Wrappers?“

## Slots wählen

- Verwende standardmäßig nur `main` und `aside` für das zweispaltige Layout.
- Verwende `header` für eine Überschrift, die oberhalb beider Spalten über die volle Breite läuft.
- Soll eine Überschrift eine eigene linke oder rechte Spalte bilden, ordne sie bevorzugt `aside` zu und positioniere `aside` und `main` responsiv.
- Verwende `top` oder `bottom` nur für echten Wrapper-Inhalt oberhalb oder unterhalb der Spalten. Eine seitliche Nutzung von `top` ist eine begründete Theme-Variante, kein Standard.
- Nutze niemals `header` oder `footer` als Ersatz für eine Spalte.

## Responsive Reihenfolge

Ändere die visuelle Reihenfolge mit Flexbox und `order`; schreibe dafür weder den DOM um noch TypeScript.

- Begrenze Desktop-Anordnungen auf `[mode='desktop']`.
- Definiere für jede Umordnung auch die gewünschte Reihenfolge unter `[mode='mobile']`.
- Eine seitliche Überschrift steht mobil normalerweise vor dem Hauptinhalt.
- Bevorzuge vorhandene Modifier wie `.reverse`, wenn sie Desktop- und Mobile-Verhalten bereits korrekt abdecken.
- Style Shadow-DOM-Bereiche von außen über `::part(...)`.

## Theme-Regeln

- Binde die vollständige visuelle Baseline an genau eine `style-*` Klasse.
- Nutze vorhandene Mixins aus `@nextrap/ntl-2col`, bevor du eigenes `::part(...)`-Styling ergänzt.
- Halte Slot-Zuweisung und Theme-Layout getrennt: Kramdown bestimmt den semantischen Bereich, SCSS dessen Darstellung.
- Prüfe nach jeder Variante mindestens Desktop und Mobile sowie den Fall ohne `aside`.
