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

## Größen

`btn-sm()`, `btn-lg()`, `btn-xl()` und `btn-xxl()` sind unabhängige Modifier-Mixins und schließen `btn()` nicht ein. Passe die Größen zentral über `--nt-btn-<size>-padding-y`, `--nt-btn-<size>-padding-x` und `--nt-btn-<size>-font-size` an, statt weitere Größenklassen anzulegen.

## Lead und Glow

| Mixin | Zweck |
|---|---|
| `btn-lead()` | Dekorativer Pfeil rechts; nutzt `::after` |
| `btn-glow()` | Allgemeiner Glow bei Hover und `:focus-visible`; nutzt `::before` |
| `btn-glow-on-view()` | Einmaliger Pure-CSS-Viewport-Trigger für `btn-glow()` |

`btn-glow-on-view()` wird zusätzlich zu `btn-glow()` eingebunden. Es verwendet `view()`, `timeline-trigger`, `trigger-scope` und `animation-trigger: play-once`. Halte es als Progressive Enhancement ohne JavaScript; nicht unterstützende Browser behalten den Hover-/Focus-Glow.

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
