---
name: nte-icon-theming
description: Verwende diesen Skill ausschließlich beim Erstellen oder Ändern eines Themes für nte-icon, seine Sass-Mixins, Parts und Größenvariable.
---

# nte-icon stylen

Lade Markup- und API-Details aus dem [Usage-Skill](../nte-icon-usage/SKILL.md).
Materialisiere die Baseline im Theme genau unter `nte-icon.style-default`.
Die Komponente setzt diese Klasse automatisch, sofern keine `style-*` Klasse
vorhanden ist. `index.scss` stellt nur die Sass-API bereit.

```scss
@use '@nextrap/nte-icon' as icon;

nte-icon.style-default { @include icon.default-style(); }
.toolbar nte-icon { --nte-icon-size: 1.25rem; }
```

`default-style()` setzt die vertikale Ausrichtung und die Deckkraft des
Platzhalters. Die funktionale quadratische Box und Font-Glyph-Zuordnung sind
bereits im Shadow DOM enthalten. Ändere die Farbe am Host; sie wird vom
Font-Icon geerbt. Bilddateien behalten ihre eigenen Farben.

Verwende `--nte-icon-size` für eine gemeinsame CSS-Größe. `height` hat Vorrang,
danach folgt die Variable, danach `size`; ohne Anpassung gilt `1em`. Die
benannten Größen skalieren relativ zum umgebenden Text. Ändere keine internen
`--_nte-icon-*` Properties.

Öffentliche Parts: `icon` für das Font-Glyph, `image` für das Bild und
`placeholder` für den Lade-/Fehlertext. Nutze `loading-state` zum Gestalten
dieser Zustände. Erhalte `aspect-ratio: 1`, die reservierten Dimensionen und
das Ausblenden noch nicht geladener Inhalte. Füge kein eigenes `@font-face`
oder Glyph am Host hinzu; der globale Loader und die internen Zuordnungen
übernehmen dies. Die Komponente besitzt keine Responsive-Modes.
