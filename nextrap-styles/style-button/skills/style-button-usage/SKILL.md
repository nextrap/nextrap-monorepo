---
name: style-button-usage
description: "@nextrap/style-button Klassen und Sass-Mixins für Standard-, Dropdown-, Größen-, Lead- und Glow-Buttons korrekt verwenden."
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

## Dropdowns

Dropdowns verwenden die native Popover API. Der auslösende Button referenziert mit `popovertarget` die ID einer nachfolgenden `.dropdown-menu` mit `popover="auto"`. Der Browser verwaltet Offen-Zustand, Escape, Light Dismiss, Fokus-Rückgabe und die logische Tab-Reihenfolge. Die CSS Anchor Positioning API platziert und flippt das Menü relativ zu seinem jeweiligen Auslöser.

Verwende für gewöhnliche Website-Aktionen und Sprachlinks normale Listen-, Link- und Button-Semantik. Setze nicht `role="menu"`, wenn keine vollständige ARIA-Menu-Tastaturlogik implementiert wird. Benenne Icon-only-Auslöser mit `aria-label`; Flaggen sind dekorativ und erhalten `aria-hidden="true"`.

Aktionsbuttons ohne Navigation können das Popover nach ihrer Ausführung nativ schließen: Setze auf ihnen `popovertarget` auf dieselbe Menü-ID und `popovertargetaction="hide"`. Der fachliche Click-Handler bleibt davon unabhängig.

```html
<button
  id="language-toggle"
  class="btn btn-outline-primary dropdown-toggle"
  type="button"
  popovertarget="language-menu"
  aria-controls="language-menu"
>
  <span aria-hidden="true">🇩🇪</span> Deutsch
</button>
<ul id="language-menu" class="dropdown-menu" popover="auto" aria-labelledby="language-toggle">
  <li><a href="?lang=de" lang="de" hreflang="de" aria-current="true">Deutsch</a></li>
  <li><a href="?lang=en" lang="en" hreflang="en">English</a></li>
</ul>
```

Ein Split-Button kombiniert eine direkte Hauptaktion mit einem separaten Dropdown-Auslöser. Beide Controls stehen in `.btn-group`; das Popover darf außerhalb der Gruppe folgen. Der Dropdown-Button benötigt einen eigenen zugänglichen Namen.

```html
<div class="btn-group" role="group" aria-label="Download und weitere Formate">
  <a class="btn btn-primary" href="/download">Herunterladen</a>
  <button
    id="download-toggle"
    class="btn btn-primary dropdown-toggle"
    type="button"
    popovertarget="download-menu"
    aria-controls="download-menu"
    aria-label="Weitere Downloadformate"
  ></button>
</div>
<ul id="download-menu" class="dropdown-menu" popover="auto" aria-label="Weitere Downloadformate">
  <li><a href="/download.pdf">PDF herunterladen</a></li>
  <li><a href="/download.docx">Word herunterladen</a></li>
</ul>
```

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
