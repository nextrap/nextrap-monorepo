---
name: style-button-theming
description: Theme-SCSS mit @nextrap/style-button entwickeln und vorhandene Button-, Lead- und Glow-Mixins korrekt kombinieren.
---

# Style Button Theming

Nutze diesen Skill für Theme-SCSS und visuelle Button-Varianten. Für Markup und Klassenwahl nutze `style-button-usage`.

## Vertrag

- `index.scss` ist eine Sass-API ohne CSS-Ausgabe; fertige Klassen kommen aus `default.scss` beziehungsweise `style-button()`.
- Öffentliche Klassen werden ausschließlich aus dem gleichnamigen Mixin erzeugt.
- Basis- und Modifier-Mixins bleiben unabhängig. Ein Modifier schließt die Basis nicht implizit ein.
- Kombiniere vorhandene Mixins, statt Varianten wie `glow-primary` oder `glow-secondary` anzulegen.

## Lead und Glow

| Mixin | Zweck |
|---|---|
| `btn-lead()` | Dekorativer Pfeil rechts; nutzt `::after` |
| `glow()` | Allgemeiner Glow bei Hover und `:focus-visible`; nutzt `::before` |
| `glow-on-view()` | Einmaliger Pure-CSS-Viewport-Trigger für `glow()` |

`glow-on-view()` wird zusätzlich zu `glow()` eingebunden. Es verwendet `view()`, `timeline-trigger`, `trigger-scope` und `animation-trigger: play-once`. Halte es als Progressive Enhancement ohne JavaScript; nicht unterstützende Browser behalten den Hover-/Focus-Glow.

Passe Farben und Timing über `--glow-color`, `--glow-duration`, `--glow-easing` und `--glow-width` an. Der Default von `--glow-color` folgt `currentColor` und funktioniert dadurch mit Filled- und Outline-Varianten.

```scss
.theme-primary-action {
  @include button.btn();
  @include button.btn-primary();
  @include button.btn-lead();
  @include button.glow();
  @include button.glow-on-view();
}
```

Lead und Glow sind für Elemente mit Pseudoelementen gedacht. Kombiniere `btn-lead()` nicht mit `dropdown-toggle()`, weil beide `::after` belegen.
