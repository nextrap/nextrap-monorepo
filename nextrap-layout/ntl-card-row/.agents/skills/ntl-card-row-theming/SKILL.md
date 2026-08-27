---
name: ntl-card-row-theming
description: Theme- und Component-Style-Klassen für @nextrap/ntl-card-row entwickeln, ohne das responsive Zwölfspalten-Layout zu überschreiben.
---

# NTL Card Row Theming

Nutze diesen Skill für Theme-SCSS und visuelle Varianten. Für Markup und Card-Breiten nutze `ntl-card-row-usage`.

## Theme-Regeln

- Binde die vollständige visuelle Baseline an genau eine `style-*` Klasse, normalerweise mit `default-style()`.
- Theme-Styles dürfen `--cols`, feste Breiten, `flex` und das Zwölfspalten-Layout nicht überschreiben.
- Nutze ausschließlich die CSS-Variable `--cols`; eine Attribut-API gehört wegen fehlender browserübergreifender Unterstützung nicht zur Komponente.
- `default-style($cols: n)` darf ausnahmsweise einen Theme-Fallback setzen. Bevorzuge `--cols` im Usage-Markup.
- Nutze für visuelle Anpassungen die Parts `container`, `header`, `main` und `footer` sowie vorhandene Mixins.
- Desktop-spezifische Regeln werden auf `[mode='desktop']` gescoped.

## Vorhandene Mixins

| Mixin | Zweck |
|---|---|
| `default-style()` | Vollständige visuelle Baseline; optionaler `$cols`-Fallback |
| `with-borderless-cards()` | Card-Rahmen und Innenabstand entfernen |
| `with-footer-separators()` | Desktop-Trenner für Footer-Cards |
| `with-item-separators()` | Responsive Trenner zwischen Cards |
| `with-raised-card()` | Einzelne Card hervorheben |
| `with-modifier-classes()` | Vorbereitete Modifier-Klassen registrieren |
