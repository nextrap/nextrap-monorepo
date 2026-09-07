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
- Setze `--gutter-x` und `--gutter-y` immer als echte Längenwerte mit Einheit, z. B. `0px`, `16px` oder `24px`, niemals als einheitsloses `0`.
- Desktop-spezifische Regeln werden auf `[mode='desktop']` gescoped.
- Für mobile Sequenzen `with-horizontal-flow()` verwenden; Themes dürfen dessen Flex-, Breiten- und Overflow-Regeln nicht nachbauen oder überschreiben.

## Vorhandene Mixins

| Mixin | Zweck |
|---|---|
| `default-style()` | Vollständige visuelle Baseline; optionaler `$cols`-Fallback |
| `with-borderless-cards()` | Card-Rahmen und Innenabstand entfernen |
| `with-footer-separators()` | Desktop-Trenner für Footer-Cards |
| `with-horizontal-flow()` | Opt-in Horizontal-Scroll mit nativer Snap-Logik ausschließlich im Mobile-Modus |
| `with-item-separators()` | Responsive Trenner zwischen Cards |
| `with-raised-card()` | Einzelne Card hervorheben |
| `with-modifier-classes()` | Vorbereitete Modifier-Klassen registrieren |

## Horizontal-Flow konfigurieren

```scss
ntl-card-row.timeline {
  @include cardRow.with-horizontal-flow(
    $visible-cols-mobile: 1.25,
    $gap: 1rem,
    $snap: proximity
  );
}
```

`default-style()` registriert zusätzlich `.with-horizontal-flow` mit den Defaults. Öffentliche Instanzwerte sind `--visible-cols-mobile`, `--horizontal-flow-gap` und `--horizontal-flow-snap`; der vorhandene `main`-Part bleibt die Scrollfläche.
