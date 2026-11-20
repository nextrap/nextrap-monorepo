# @nextrap/style-base

Global Nextrap design tokens implemented entirely with CSS custom properties.

`style-base` erzeugt ausschließlich Tokens, keine Resets, Element-Styles oder
Utility-Klassen. Materialisiere die Theme-Tokens einmal auf Dokument-/Theme-Ebene,
niemals erneut im Shadow DOM einer Komponente. Der reine Sass-API-Import für die
Kontrastfunktion erzeugt keine Tokens oder visuellen Regeln.

## The theming model

There is one theme engine and one public mixin: `runtime-theme()`.

It emits the complete default Nextrap token graph into the current selector **and** the global selectors required to force light or dark mode. A theme is created by calling the mixin and then overriding only the CSS input variables that differ from the defaults. Derived colors, interaction states, surfaces, spacing aliases, typography scales and contrast colors are calculated from those variables by CSS.

There is no Sass theme map, compile-time theme creation step or separate scheme mixin.

## Use the default theme

For the standard Nextrap theme, import `default.scss` once:

```scss
@use '@nextrap/style-base/default';
```

This emits `runtime-theme()` on `:root`. Nothing else is required.

## Build a custom theme

```scss
@use '@nextrap/style-base' as nt;

:root {
  @include nt.runtime-theme();

  --nt-primary: light-dark(#0057b8, #65b7ff);
  --nt-accent: light-dark(#d79b35, #f0b95c);
  --nt-neutral: #667085;
  --nt-radius: .5rem;
  --nt-font-family: Inter, sans-serif;
  --nt-container-max: 1280px;
}
```

The order is intentional: emit `runtime-theme()` first, then override inputs. The later declarations become the theme values while all derived variables continue to reference them.

A theme should normally override input tokens, not copy the generated token graph. Typical inputs are brand/state colors, typography, `--nt-radius`, container values and—when intentionally customized—the primitive spacing scale.

Override a derived token only for a deliberate design exception:

```scss
:root {
  @include nt.runtime-theme();

  --nt-primary: light-dark(#0057b8, #65b7ff);
  --nt-neutral: #667085;
  --nt-surface: light-dark(#fbfcfd, #101418);
}
```

## Light and dark switching

Light/dark switching is built into `runtime-theme()`.

With no `data-nt-scheme` attribute, the browser follows the operating-system preference because the theme declares:

```css
color-scheme: light dark;
```

To force a mode, set the attribute on the document element:

```html
<html data-nt-scheme="light">
```

or:

```html
<html data-nt-scheme="dark">
```

To return to the OS preference, remove the attribute.

For example:

```js
// Force dark.
document.documentElement.dataset.ntScheme = 'dark';

// Force light.
document.documentElement.dataset.ntScheme = 'light';

// Follow the operating system again.
delete document.documentElement.dataset.ntScheme;
```

A theme can provide different input values for the two schemes with `light-dark()`:

```css
--nt-primary: light-dark(#0057b8, #65b7ff);
--nt-accent: light-dark(#d79b35, #f0b95c);
```

The derived tokens use the active `color-scheme` automatically. Light and dark are therefore **two schemes of the same theme**, not separate theme definitions.

## Build a scoped theme

Themes do not have to live on `:root`:

```scss
@use '@nextrap/style-base' as nt;

:where(.theme-customer) {
  @include nt.runtime-theme();

  --nt-primary: light-dark(#6d28d9, #a78bfa);
  --nt-accent: light-dark(#db2777, #f472b6);
  --nt-neutral: #71717a;
}
```

Descendant components inherit the resulting `--nt-*` values. `data-nt-scheme="light|dark"` may be placed on the document or an ancestor of a scoped theme to control its active scheme.

## External theme repositories

An external theme package should own only its overrides and use `style-base` as the token engine:

```scss
@use '@nextrap/style-base' as nt;

:root {
  @include nt.runtime-theme();

  --nt-primary: light-dark(#0057b8, #65b7ff);
  --nt-accent: light-dark(#ffb000, #ffd166);
  --nt-neutral: #667085;
  --nt-radius: .375rem;
  --nt-font-family: 'Example Sans', sans-serif;
}
```

Do not duplicate Nextrap's derived variables in the external repository unless the design explicitly needs an exception. This keeps new derived tokens and fixes in `style-base` available automatically.

## Icon tokens

Monochrome shared icons are provided as SVG mask values. Components apply their own foreground color through `background-color`:

```css
.icon-close {
  background-color: currentColor;
  mask: var(--nt-icon-close) center / contain no-repeat;
}
```

Available icons:

- `--nt-icon-close`
- `--nt-icon-close-sidebar` — base orientation points toward the left edge and can be rotated for other placements.

## Spacing model

Spacing has two layers:

1. `--nt-space-0` through `--nt-space-10` are primitive scale steps.
2. Semantic aliases express intent: `--nt-spacing-text`, `--nt-spacing-control`, `--nt-spacing-component`, `--nt-spacing-layout`, `--nt-spacing-section`.

Prefer semantic spacing in application/component code. The structural progression is **text → control → component → layout → section**.

```css
.article-copy > * + * { margin-block-start: var(--nt-spacing-text); }
.toolbar { gap: var(--nt-spacing-control); }
.card { padding: var(--nt-spacing-component); }
.card-grid { gap: var(--nt-spacing-layout); }
.page-section + .page-section { margin-block-start: var(--nt-spacing-section); }
```

## Kontrastfarben

Für Text auf einer Farbfamilie steht `--nt-text-on-<family>` bereit. Die zwölf
Basis-Kontrasttokens bleiben die gemeinsame Theme-API. Zustandsabhängige Flächen
verwenden die unten beschriebene Kontrastfunktion direkt im jeweiligen Selektor;
dafür gibt es keine zusätzlichen globalen Hover-/Active-Text-Tokens.
Die vollständige CSS-Berechnung bevorzugt Weiß, wenn es mindestens `4.5:1`
erreicht, andernfalls Schwarz. Grundlage ist die ungerundete relative Luminanz
nach [WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

Die Standard-Primary-Farbe `#0969da` erreicht mit Weiß etwa `5.19:1`. Die
Basisflächen von Success, Tertiary, Info und Warning verwenden Schwarz, weil
Weiß dort die Schwelle nicht erreicht.

Die Engine ergänzt die Kontrastwahl abhängig von der Browser-Unterstützung:

1. Statische Vordergründe zur Standardpalette.
2. Natives [contrast-color()](https://www.w3.org/TR/css-color-5/#contrast-color),
   sofern unterstützt, mit seiner eigenen Schwarz-/Weißauswahl.
3. Die Weißpräferenz über relative `color(srgb-linear ...)`-Berechnung, sofern
   `@supports` den vollständigen benötigten Ausdruck akzeptiert.

Statische Fallbacks garantieren keinen Kontrast für frei veränderte Themes.
Die Berechnung gilt für deckende sRGB-Flächen; Transparenz benötigt den realen
Backdrop, Wide-Gamut-Farben eine eigene Prüfung. Die Tokens sind keine
allgemeine Barrierefreiheitsgarantie.

## Component contract

Komponenten konsumieren die globalen Tokens über `var(--nt-*)`. Für eine andere
Fläche stellt die öffentliche Sass-API ab Version `2.1.0` die Funktion
`contrast-foreground($background)` bereit. Sie erzeugt nur den CSS-Farbausdruck;
die Berechnung bleibt im Browser. Import und Funktionsaufruf materialisieren
weder Tokens noch visuelle Regeln und benötigen keine privaten Sass-Imports.

Der Aufrufer setzt einen Fallback und prüft den vollständigen Ausdruck mit
`@supports`. Dieses Beispiel ergänzt eine Primary-Aktion um Hover-Kontrast:

```scss
// Die öffentliche Funktion teilt die Formel, ohne das Theme erneut auszugeben.
@use '@nextrap/style-base' as nt;

// Der Grundzustand berücksichtigt auch explizite Theme-Overrides der Textfarbe.
.action {
  background: var(--nt-primary);
  color: var(--nt-text-on-primary);

  // Der Fallback passt zur Default-Palette; die Berechnung folgt der Hover-Fläche.
  &:hover {
    background: var(--nt-primary-hover);
    color: light-dark(white, black);

    @supports (color: contrast-color(red)) {
      color: contrast-color(var(--nt-primary-hover));
    }

    @supports (color: #{nt.contrast-foreground('red')}) {
      color: nt.contrast-foreground('var(--nt-primary-hover)');
    }
  }
}
```

Active verwendet entsprechend seine tatsächliche Hintergrundfarbe als Eingabe.
Die Formel gehört in diesen Selektor, damit lokale Variablen dort ausgewertet
werden. Prüfe statische Fallbacks erneut, wenn die Palette verändert wird.

## API summary

`@nextrap/style-base` exports one theming mixin:

- `runtime-theme()` — emits the complete runtime token graph and automatic/manual light-dark scheme support.

Zusätzlich exportiert die Sass-API ab `2.1.0`
`contrast-foreground($background)` für die direkte Laufzeit-Kontrastberechnung
in Komponenten. Die Funktion allein erzeugt keine CSS-Ausgabe.

`@nextrap/style-base/default` remains the ready-to-use standard theme and emits `runtime-theme()` on `:root`.

For the complete CSS-variable contract and guidance for every token, see `.ai-usage-info.md`.
