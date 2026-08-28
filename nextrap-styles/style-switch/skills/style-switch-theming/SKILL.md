---
name: style-switch-theming
description: "Theme-SCSS mit @nextrap/style-switch entwickeln und Basis-, Größen- und Style-Mixins korrekt kombinieren."
---

# Style Switch Theming

Nutze diesen Skill für Theme-SCSS und visuelle Switch-Varianten. Für Markup und Klassenwahl nutze `style-switch-usage`.

## Vertrag

- `index.scss` ist eine Sass-API ohne CSS-Ausgabe; `default.scss` beziehungsweise `style-switch()` materialisiert die Klassen.
- Jede öffentliche Klasse wird ausschließlich aus dem gleichnamigen Mixin erzeugt.
- Basis-, Größen- und Style-Mixins bleiben unabhängig und können am selben Selektor kombiniert werden.
- Die native Input-Semantik und die sichtbaren Focus-Styles dürfen vom Theme nicht entfernt werden.

## Mixins

| Gruppe | Mixins |
|---|---|
| Struktur | `switch()`, `switch-input()`, `switch-control()`, `switch-label()` |
| Größen | `switch-sm()`, `switch-lg()`, `switch-xl()` |
| Styles | `switch-outline()`, `switch-material()`, `switch-square()`, `switch-icon()` |
| Anordnung | `switch-label-start()` |

```scss
@use '@nextrap/style-switch' as switch;

.theme-settings-switch {
  @include switch.switch();
  @include switch.switch-material();
  @include switch.switch-lg();
}
```

Theme-Werte werden bevorzugt über die lokalen `--switch-*` Variablen oder bestehende `--nt-*` Tokens angepasst. Größenmodifier verändern Track und Thumb, nicht die Label-Schriftgröße. `switch-icon()` ist rein dekorativ; der zugängliche Name bleibt Aufgabe des Inputs und Labels.
