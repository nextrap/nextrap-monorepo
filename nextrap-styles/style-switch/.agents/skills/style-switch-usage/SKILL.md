---
name: style-switch-usage
description: "@nextrap/style-switch Markup, Größen, Varianten und barrierefreie Beschriftung korrekt verwenden."
---

# Style Switch Usage

Nutze diesen Skill für Switch-Markup und die Auswahl vorhandener Klassen. Für Theme-SCSS nutze `style-switch-theming`.

## Auswahl

Ein Switch steht für eine binäre Einstellung, die unmittelbar wirksam wird. Für Mehrfachauswahl in einem Formular ist eine Checkbox passender; für eine Aktion ein Button.

## Markup und Accessibility

```html
<label class="switch switch-material">
  <input class="switch-input" type="checkbox" role="switch" checked />
  <span class="switch-control" aria-hidden="true"></span>
  <span class="switch-label">Benachrichtigungen</span>
</label>
```

- Die Reihenfolge Input → Control → Label ist verbindlich.
- Der native Checkbox-Zustand ist die einzige Zustandsquelle; setze `checked` beziehungsweise `disabled` am Input.
- `role="switch"` gibt der binären Einstellung die passende Semantik.
- Ein sichtbares Label, `aria-label` oder `aria-labelledby` muss einen zugänglichen Namen liefern.
- Setze kein statisches `aria-checked`; der native Input spiegelt den Zustand selbst.
- Ergänzende Hinweise werden mit `aria-describedby` referenziert.

## Klassen

- Basis: `.switch`, `.switch-input`, `.switch-control`, `.switch-label`
- Größen: `.switch-sm`, `.switch-lg`, `.switch-xl`
- Styles: `.switch-outline`, `.switch-material`, `.switch-square`, `.switch-icon`
- Labelposition: `.switch-label-start`

Style- und Größenmodifier werden zusätzlich zu `.switch` am umschließenden Label gesetzt. `.switch-control` bleibt dekorativ und erhält `aria-hidden="true"`.
