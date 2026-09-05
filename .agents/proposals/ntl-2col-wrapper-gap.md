# `ntl-2col` konfigurierbarer Wrapper-Gap

| Datum | Benutzername | Kurzbeschreibung |
| --- | --- | --- |
| 2026-09-05 | dermatthes | Proposal aus der im Unify-Theme validierten Vorversion erstellt. |

**Status:** Draft zur Review; die Vorversion ist in `leuffen/themejs2` PR #40 eingebunden und kompiliert.

## § 1 Ziel und bestätigte Lücke

`@nextrap/ntl-2col` soll einen expliziten, kombinierbaren Wrapper-Gap anbieten, der unabhängig von `--inner-padding` konfiguriert werden kann. Das wird für wiederverwendbare Bild-/Zitat-, Editorial- und Showcase-Kompositionen benötigt, deren Spaltenabstand deutlich größer als der innere Content-Padding ist.

`default-style($gap)` setzt heute `--gap`, der veröffentlichte Wrapper erhält jedoch bewusst `gap: var(--inner-padding)`. Der aktuelle Default-Contract bleibt damit stabil, aber `$gap` beziehungsweise `--gap` kann den tatsächlichen Abstand zwischen `main` und `aside` nicht opt-in steuern.

→ Vereinfacht später große Bild-/Text-Kompositionen in Themes, ohne dass jedes Theme `::part(wrapper)` direkt überschreibt.

## § 2 Validierte Vorversion

Die Vorversion liegt in `leuffen/themejs2` unter `theme/unify/upstream-proposal/ntl-2col/_with-wrapper-gap.scss` und wird von `style-testimonial` tatsächlich eingebunden.

```scss
// Koppelt den sichtbaren Wrapper-Abstand opt-in an die bestehende öffentliche Gap-Variable.
@mixin with-wrapper-gap($gap: var(--nt-spacing-layout)) {
  --gap: #{$gap};

  &::part(wrapper) {
    gap: var(--gap);
  }
}
```

Der gemeinsame Theme-Build kompiliert damit erfolgreich. Im Unify-Testimonial wurden bei 1348 Pixel Viewport ein Wrapper-Gap von rund 94 Pixeln und die Referenzgeometrie der beiden Spalten erreicht, ohne `--inner-padding` als Content-Padding umzudeuten.

## § 3 Vorgeschlagene öffentliche API

### § 3.1 Mixin und Modifier

- Neue Datei `src/scss/_with-wrapper-gap.scss` mit `with-wrapper-gap($gap: var(--nt-spacing-layout))`.
- Export über `index.scss`.
- Registrierung von `.with-wrapper-gap` in `with-modifier-classes()`, damit der Modifier mit `style-default` kombinierbar ist.
- Das Mixin bleibt selektorunabhängig; die Modifier-Klasse ist nur die vorbereitete Standardbindung.

```scss
// Bindet den größeren Wrapper-Abstand an eine semantische Theme-Variante.
ntl-2col.style-editorial {
  @include twoCol.default-style();
  @include twoCol.with-wrapper-gap($gap: clamp(4rem, 7vw, 6rem));
}
```

### § 3.2 Content-Pane-Beispiel

```markdown
## Kundenstimme
{: layout="ntl-2col.with-wrapper-gap.reverse" section-style="--cols: 6; --gap: 6rem;"}

> Ein frei editierbares Zitat mit deutlichem Abstand zum Bild.

![Porträt](./portrait.jpg)
```

`--gap` bleibt die vorhandene öffentliche Konfiguration. Der neue Modifier sorgt lediglich dafür, dass der Wrapper sie opt-in konsumiert; `--inner-padding` steuert weiterhin ausschließlich die inneren Abstände von `main`, `aside`, `top` und `bottom`.

## § 4 Responsive- und Styling-Vertrag

- Der Modifier wirkt in allen vorhandenen Modi und benötigt keine Media Query.
- Themes können `--gap` pro Instanz oder über das Mixin konfigurieren.
- `.reverse`, `.reverse-desktop`, Breakouts, Justify-Modifier und die bestehende Slot-Reihenfolge bleiben unverändert.
- Das Mixin enthält keine Farben, Typografie, Flächen, Borders oder andere visuelle Theme-Werte.
- Die bestehende `default-style()`-Ausgabe ohne Modifier bleibt unverändert.

## § 5 Non-Goals

- Keine Änderung von `default-style()` auf `gap: var(--gap)`, weil dies bestehende Layouts mit abweichendem `$gap` unbeabsichtigt verändern könnte.
- Keine neue `style-*`-Variante.
- Keine Änderung an Shadow DOM, TypeScript, Slots oder Content-Zuordnung.
- Keine zusätzliche CSS-Variable neben dem vorhandenen `--gap`.
- Keine automatische mode-spezifische Skalierung; diese bleibt Theme- oder Instanzentscheidung.

## § 6 Betroffene Dateien bei Umsetzung

- `nextrap-layout/ntl-2col/src/scss/_with-wrapper-gap.scss`
- `nextrap-layout/ntl-2col/src/scss/_with-modifier-classes.scss`
- `nextrap-layout/ntl-2col/index.scss`
- package-lokale Usage-/Theming-Skills, `.ai-usage-info.md`, README, Demo und Web-Types
- SCSS-/Package-Tests für Mixin-Export, Modifier-Class und unveränderte Default-Ausgabe

Die Änderung bleibt vollständig in `@nextrap/ntl-2col`; neue Dependencies oder Änderungen an anderen Packages sind nicht erforderlich.

## § 7 Akzeptanzkriterien

- Ohne `.with-wrapper-gap` bleibt der bestehende Wrapper-Gap an `--inner-padding` gekoppelt.
- Mit Modifier oder direktem Mixin verwendet `::part(wrapper)` den konfigurierten `--gap`.
- Ein Inline-Wert wie `--gap: 6rem` überschreibt den Mixin-Default.
- `--inner-padding` behält seine bisherige Wirkung auf Content-Padding.
- Mobile und Desktop behalten Slot-Reihenfolge, Spaltenlogik und vorhandene Modifier.
- Mixin/Class-Parität, Content-Pane-Demo, Skills, README, `.ai-usage-info.md` und Web-Types sind aktualisiert.
- Sass-/Package-Build und bestehende Tests laufen erfolgreich.
- Das Unify-Testimonial kann nach Veröffentlichung die lokale Vorversion entfernen und ohne direkten Wrapper-Part-Override weiter rendern.
