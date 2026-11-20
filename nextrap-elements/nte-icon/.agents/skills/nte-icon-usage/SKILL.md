---
name: nte-icon-usage
description: Verwende diesen Skill für nte-icon-Markup mit src oder Bootstrap-Klassen in Websites und Buttons; nicht für Theme-Erstellung.
---

# nte-icon verwenden

Importiere `@nextrap/nte-icon`. Setze `src` für Bilder oder Klassen wie
`bi bi-house` für Font-Icons. `src` ist die einzige Property und hat Vorrang.

```html
<nte-icon class="bi bi-house" role="img" aria-label="Startseite"></nte-icon>
<nte-icon src="/logo.svg" style="--nte-icon-size: 2rem" aria-hidden="true"></nte-icon>
```

Nutze native ARIA-Attribute; beschrifte Icon-only-Buttons am Button und setze
am dekorativen Icon `aria-hidden="true"`. Steuere Größe und Farbe ausschließlich
per CSS; verwende keine Attribute für Größe, Höhe, Label oder Platzhalter.
Füge keinen Inhalt in den Default-Slot ein; dieser dient nur der Diagnose.

Überschreibe bei Bedarf `NTE_ICON_CONFIG.bootstrapIconsFontUrl` vor der ersten
Instanz. CSS löst den Download der einmal registrierten Schrift aus.
[Größenklassen und Styling](../nte-icon-theming/SKILL.md).
