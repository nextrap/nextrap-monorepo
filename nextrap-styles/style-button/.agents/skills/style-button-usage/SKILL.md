---
name: style-button-usage
description: "@nextrap/style-button Klassen und Sass-Mixins für Standard-, Lead- und Glow-Buttons korrekt verwenden."
---

# Style Button Usage

Nutze diesen Skill für Button-Markup und die Auswahl vorhandener Klassen. Für Theme-SCSS nutze `style-button-theming`.

## Import

Fertige Klassen:

```scss
@use '@nextrap/style-button/default';
```

Sass-Mixins ohne globale CSS-Ausgabe:

```scss
@use '@nextrap/style-button' as button;
```

Der Button übernimmt seine Roundness automatisch aus `--nt-border-radius`; Themes steuern sie zentral über die `style-base` Eingabe `--nt-radius`.

## Lead und Glow

- `.btn-lead` ergänzt einen Pfeil rechts.
- `.btn-glow` löst den Glow bei Hover und `:focus-visible` aus.
- `.btn-glow-on-view` ergänzt genau eine Viewport-Auslösung und wird immer mit `.btn-glow` kombiniert.

```html
<a class="btn btn-primary btn-lead btn-glow btn-glow-on-view" href="/termin">
  Termin vereinbaren
</a>

<a class="btn btn-outline-primary btn-lead btn-glow" href="/mehr">
  Mehr erfahren
</a>
```

Damit animiert nur der Primary-Button beim Eintritt in den Viewport; beide Buttons glühen bei Hover und Tastaturfokus. Die Viewport-Auslösung ist Pure CSS und ein Progressive Enhancement. Füge keinen JavaScript-Observer hinzu.

Verwende Lead und Glow auf `<a>` oder `<button>`, nicht auf `<input>`, da Pseudoelemente benötigt werden. Kombiniere `.btn-lead` nicht mit `.dropdown-toggle`.

Passe den Effekt bei Bedarf über `--btn-glow-color`, `--btn-glow-duration`, `--btn-glow-easing`, `--btn-glow-width`, `--btn-lead-gap` und `--btn-lead-offset` an.
