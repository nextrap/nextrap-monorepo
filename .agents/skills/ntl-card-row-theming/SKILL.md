---
name: ntl-card-row-theming
description: Nutze diesen Skill beim Anlegen oder Ändern von Theme- und Component-Style-Klassen für @nextrap/ntl-card-row; er schützt das responsive 12-Spalten-Layout vor Theme-Overrides.
---

# NTL Card Row Theming

Lies zuerst `nextrap-layout/ntl-card-row/.ai-usage-info.md`.

## Theme-Klassen

- Binde die vollständige visuelle Baseline an genau eine `style-*` Klasse, normalerweise mit `default-style()`.
- Theme-Styles dürfen `--cols`, feste Breiten, `flex` und das 12-Spalten-Layout nicht überschreiben.
- Nutze ausschließlich die CSS-Variable `--cols`; eine Attribut-API gehört vorerst wegen fehlender browserübergreifender Unterstützung nicht zur Komponente.
- `default-style($cols: n)` darf ausnahmsweise einen Theme-Fallback setzen. Setze normalerweise `--cols` im Usage-Markup, damit die Verwendung flexibel bleibt.
- Ein `--cols`-Wert an einer Card überschreibt den geerbten Row-Wert. Ohne `--cols` nutzt jede Card die volle verfügbare Zeile.
- Desktop verwendet feste Spalten von 1 bis 12; mobil stehen Cards immer untereinander in voller Breite.
- Nutze für visuelle Anpassungen die Parts `container`, `header`, `main` und `footer` sowie die vorhandenen Mixins.

## Vorhandene Mixins

| Mixin | Zweck |
|---|---|
| `default-style()` | Vollständige visuelle Baseline; optionaler `$cols`-Fallback |
| `with-borderless-cards()` | Card-Rahmen und Innenabstand entfernen |
| `with-footer-separators()` | Desktop-Trenner für Footer-Cards |
| `with-item-separators()` | Responsive Trenner zwischen Cards |
| `with-raised-card()` | Einzelne Card hervorheben |
| `with-modifier-classes()` | Vorbereitete Modifier-Klassen registrieren |
