---
name: ntl-columns-theming
description: "Theme- und Component-Styles für @nextrap/ntl-columns über Parts und Sass-Mixins gestalten."
---

# NTL Columns Theming

Für Markup siehe [ntl-columns-usage](../ntl-columns-usage/SKILL.md).

Parts: `wrapper`, `start`, `center`, `end`. Verwende das Mixin
`default-style($gap)` für den Spaltenabstand, gebunden an eine
`style-*`-Klasse. Farben, Rahmen und Padding kommen aus dem Theme.

```scss
@use '@nextrap/ntl-columns' as columns;

ntl-columns.style-default {
  @include columns.default-style(1rem);

  &::part(start) {
    --grid-cols: 3;
  }
}
```

Die Gewichte 4:6:4 werden proportional verteilt. `--grid-cols` am Part
überschreibt `--start-cols`, `--center-cols` bzw. `--end-cols` am Host.
Desktop, Reverse und Preserve Empty
werden über Klassen gesteuert. Überschreibe nicht die funktionale
Flex-Richtung oder das Ausblenden leerer Regionen.
