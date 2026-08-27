---
name: style-button-usage
description: "@nextrap/style-button Klassen und Sass-Mixins für Standard-, Größen-, Lead- und Glow-Buttons korrekt verwenden."
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

## Größen

Die Größenmodifier `.btn-sm`, `.btn-lg`, `.btn-xl` und `.btn-xxl` werden immer zusätzlich zu `.btn` gesetzt. Ohne Größenmodifier gilt die Standardgröße.

```markdown
[Kompakte Aktion](/aktion-kompakt){: .btn .btn-secondary .btn-sm }

[Große Aktion](/aktion-gross){: .btn .btn-primary .btn-xl }

[Zentrale Hauptaktion](/hauptaktion){: .btn .btn-primary .btn-xxl }
```

## Lead und Glow

- `.btn-lead` ergänzt einen Pfeil rechts.
- Der erste sichtbare Hauptbutton mit `.btn-primary` im Viewport soll in der Regel auch `.btn-lead` tragen.
- `.btn-glow` löst den Glow bei Hover und `:focus-visible` aus und eignet sich besonders für Buttons, die einen Abschluss markieren oder in eine klare nächste Hauptaktion weiterführen.
- `.btn-glow-on-view` ergänzt eine automatische Viewport-Auslösung und wird immer mit `.btn-glow` kombiniert.
- Die automatische Glow-Auslösung beim Laden bzw. erneuten Eintritt in den Viewport soll sparsam eingesetzt werden: normalerweise nur auf dem ersten Haupt-Lead-Button der Seite und gegebenenfalls noch einmal auf dem abschließenden Lead-Button am Seitenende.

```markdown
[Termin vereinbaren](/termin){: .btn .btn-primary .btn-lead .btn-glow .btn-glow-on-view }

[Mehr erfahren](/mehr){: .btn .btn-outline-primary .btn-lead .btn-glow }
```

Damit animiert der erste Haupt-Lead-Button beim Eintritt in den Viewport und erneut, wenn er später wieder in den Viewport kommt; technisch wird das typischerweise über ein Trigger-Verhalten wie `replay reset` erreicht. Beide Buttons glühen bei Hover und Tastaturfokus. Ein weiterer `btn-glow-on-view` ist nur für einen klaren Abschluss-CTA am Seitenende sinnvoll. Die Viewport-Auslösung ist Pure CSS und ein Progressive Enhancement. Füge keinen JavaScript-Observer hinzu.

Verwende Lead und Glow auf `<a>` oder `<button>`, nicht auf `<input>`, da Pseudoelemente benötigt werden. Kombiniere `.btn-lead` nicht mit `.dropdown-toggle`.

Passe den Effekt bei Bedarf über `--btn-glow-color`, `--btn-glow-duration`, `--btn-glow-easing`, `--btn-glow-width`, `--btn-lead-gap` und `--btn-lead-offset` an.
