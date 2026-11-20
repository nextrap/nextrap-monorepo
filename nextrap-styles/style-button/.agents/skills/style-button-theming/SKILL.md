---
name: style-button-theming
description: Theme-SCSS mit @nextrap/style-button entwickeln und vorhandene Größen-, Lead- und Glow-Mixins korrekt kombinieren.
---

# Style Button Theming

Nutze diesen Skill für Theme-SCSS und visuelle Button-Varianten. Für Markup und Klassenwahl nutze `style-button-usage`.

## Vertrag

- `index.scss` ist eine Sass-API ohne CSS-Ausgabe; fertige Klassen kommen aus `default.scss` beziehungsweise `style-button()`.
- Öffentliche Klassen werden ausschließlich aus dem gleichnamigen Mixin erzeugt.
- Basis- und Modifier-Mixins bleiben unabhängig. Ein Modifier schließt die Basis nicht implizit ein.
- Kombiniere vorhandene Mixins, statt Varianten wie `btn-glow-primary` oder `btn-glow-secondary` anzulegen.
- Der Standardradius kommt aus `--nt-border-radius`, das `style-base` aus der Theme-Eingabe `--nt-radius` ableitet. Lege im Button keinen festen Theme-Radius fest.
- Die Sass-API benötigt `@nextrap/style-base` in Version `^2.1.0` als Peer für
  die gemeinsame Kontrastfunktion. Der Import materialisiert keine Theme-Tokens.

## Basis und neutrale Aktionen

`btn()` verwendet die Primary-Farbe, `font-weight: 500` und den zentralen
Theme-Radius. Die Basis normalisiert `box-sizing: border-box` und
`display: inline-flex`; `align-items: center` und `justify-content: center`
zentrieren ihren Inhalt. `font: inherit` übernimmt die Kontextschrift mitsamt
Zeilenhöhe, bevor `font-weight: 500` das Control-Gewicht festlegt.

`btn-neutral()` ist ein unabhängiger Farbmodifier und schließt `btn()` nicht
ein. Er verwendet `--nt-surface` für die Fläche, `--nt-text` für den Text und
`--nt-border` für den Rand; Hover und Active nutzen `--nt-surface-muted`.
`style-button()` erzeugt `.btn-neutral` ausschließlich aus diesem Mixin.

```scss
// Die öffentliche Sass-API stellt Basis und unabhängige Modifier bereit.
@use '@nextrap/style-button' as button;

// Zurückhaltende UI-Aktionen verwenden neutrale Farben in der normalen Größe.
.workspace-action {
  @include button.btn();
  @include button.btn-neutral();
}
```

## Kontrast und Zustandsfarben

Filled-Varianten beziehen ihren normalen Vordergrund über `--btn-txt` aus
`--nt-text-on-<family>`. Explizite Overrides dieser Basisfarbe bleiben wirksam.
Hover und Active berechnen die Textfarbe direkt aus `--btn-bg-hover`
beziehungsweise `--btn-bg-active`. Die gemeinsame öffentliche Sass-Funktion
`contrast-foreground()` aus `style-base` erzeugt dafür den Laufzeit-Ausdruck;
zusätzliche globale oder lokale Textvariablen gibt es nicht.

Outline-Hover füllt mit der Basisfarbe; Active verwendet die Active-Fläche auch
ohne Hover. Beide gefüllten Zustände berechnen deren Kontrastfarbe.
`btn-neutral()` verwendet weiterhin `--nt-text`. Link-, Text- und ungefüllte
Outline-Zustände behalten ihre eigenen semantischen Textfarben. Der
Dropdown-Pfeil folgt über `currentColor` der tatsächlichen Textfarbe.

Die Token-Engine bevorzugt bei vollständiger CSS-Unterstützung Weiß ab `4.5:1`
nach [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html),
sonst Schwarz. Davor greifen lokale Fallbacks für die Default-Zustände und,
sofern unterstützt, natives
[contrast-color()](https://www.w3.org/TR/css-color-5/#contrast-color).
Statische Fallbacks decken beliebige Theme-Overrides nicht zuverlässig ab.
Die Berechnung gilt für deckende sRGB-Flächen; prüfe Transparenz gegen den
tatsächlichen Backdrop und Wide-Gamut-Farben separat. Das ersetzt keine
allgemeine Barrierefreiheitsprüfung.
Prüfe die normalen Brand-/Linkfarben ungefüllter Outline- und Link-Buttons
zusätzlich gegen ihren tatsächlichen Seitenuntergrund.

Setze eigene Zustandsflächen über die vorhandenen Hintergrundvariablen. Ein
Override von `--btn-txt` gilt für den Grundzustand; eine bewusst abweichende
Zustands-Textfarbe gehört als geprüfte `color`-Regel in den jeweiligen Selektor.
Kopiere die Kontrastformel nicht in ein Theme und importiere keine privaten
Sass-Dateien von `style-base`.

Die Button-Basis verwendet `transition: none`, damit Vordergrund und Fläche
ohne graue Zwischenfarben wechseln. Füge keine pauschale Farbtransition hinzu,
ohne die Zwischenzustände zu prüfen. Lead-/Glow-Effekte bleiben eigenständig.

## Größen

`btn-sm()`, `btn-lg()`, `btn-xl()` und `btn-xxl()` sind unabhängige Modifier-Mixins
und schließen `btn()` nicht ein. Passe das Padding zentral über
`--nt-btn-<size>-padding-y` und `--nt-btn-<size>-padding-x` an, statt weitere
Größenklassen anzulegen. Die größeren Varianten verwenden außerdem
`--nt-btn-<size>-font-size`.

`btn-sm()` ändert ausschließlich das Padding mit Fallbacks von `0.25rem`
vertikal und `0.5rem` horizontal. Overrides über `--nt-btn-sm-padding-y` und
`--nt-btn-sm-padding-x` haben Vorrang. Der Modifier setzt keine eigene
Schriftgröße oder Zeilenhöhe; ohne Größenmodifier gilt die normale Größe.

## Lead und Glow

| Mixin | Zweck |
|---|---|
| `btn-lead()` | Dekorativer Pfeil rechts; nutzt `::after` |
| `btn-glow()` | Allgemeiner Glow bei Hover und `:focus-visible`; nutzt `::before` |
| `btn-glow-on-view()` | Pure-CSS-Viewport-Trigger für `btn-glow()` mit Re-Trigger bei erneutem Eintritt |

`btn-glow-on-view()` wird zusätzlich zu `btn-glow()` eingebunden. Es verwendet `view()`, `timeline-trigger`, `trigger-scope` und `animation-trigger`, typischerweise mit `replay reset`, damit der Effekt beim erneuten Eintritt in den Viewport wieder starten kann. Halte es als Progressive Enhancement ohne JavaScript; nicht unterstützende Browser behalten den Hover-/Focus-Glow.

Setze Lead und Glow in Themes bewusst ein: Der erste sichtbare Hauptbutton mit Primary-Variante soll in der Regel auch `btn-lead()` erhalten. `btn-glow()` eignet sich besonders für Abschluss-CTAs oder Buttons, die klar in die nächste Hauptaktion weiterführen. `btn-glow-on-view()` soll sparsam bleiben und normalerweise nur auf dem ersten Haupt-Lead-Button sowie gegebenenfalls noch einmal auf einem abschließenden Lead-Button am Seitenende verwendet werden.

Passe Farben und Timing über `--btn-glow-color`, `--btn-glow-duration`, `--btn-glow-easing` und `--btn-glow-width` an. Der Default von `--btn-glow-color` folgt `currentColor` und funktioniert dadurch mit Filled- und Outline-Varianten.

```scss
.theme-primary-action {
  @include button.btn();
  @include button.btn-primary();
  @include button.btn-lead();
  @include button.btn-glow();
  @include button.btn-glow-on-view();
}
```

Lead und Glow sind für Elemente mit Pseudoelementen gedacht. Kombiniere `btn-lead()` nicht mit `dropdown-toggle()`, weil beide `::after` belegen.
