---
name: nte-icon-theming
description: Verwende diesen Skill ausschließlich für Themes mit nte-icon, seiner Größenvariable und den optionalen Größenklassen.
---

# nte-icon stylen

Die Basis im Shadow DOM ist eine quadratische Inline-Box von `1em × 1em`.
Setze `font-size` oder `--nte-icon-size` für die Größe und `color` am Host.
Materialisiere bei Bedarf die Größenklassen im Light DOM:

```scss
@use '@nextrap/nte-icon' as icon;
nte-icon { @include icon.sizes(); }
.toolbar nte-icon { --nte-icon-size: 1.25rem; }
```

`size-xs/sm/md/lg/xl/xxl` entsprechen `.75/.875/1/1.25/1.5/2em`.
Es gibt kein `default-style()` und keine automatische `style-default`-Klasse.
Die statische Bootstrap-CSS wählt das Glyph direkt anhand der Host-Klasse;
Bild-Styles sind über `::part(image)` erreichbar. Erhalte die quadratische
Grundfläche. Native ARIA-Attribute stehen im [Usage-Skill](../nte-icon-usage/SKILL.md).
